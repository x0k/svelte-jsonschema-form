import { getValueByPath } from "@sjsf/form/lib/object";
import { type SchemaDefinition, resolveAllReferences } from "@sjsf/form/core";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  pathToId,
  type Config,
  type FieldErrors,
  type FormValidator,
  type Schema,
  type SchemaValue,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import { z, type ZodIssue, type ZodSchema } from "zod";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { weakMemoize } from "@sjsf/form/lib/memoize";

const FIELD_REQUIRED = ["field"];
const FIELD_NOT_REQUIRED: string[] = [];
const NO_ERRORS: FieldErrors<ZodIssue> = [];

function evalZodSchema(schema: Schema) {
  return new Function("z", `return ${jsonSchemaToZod(schema)}`)(z);
}

export class Validator implements FormValidator<ZodIssue> {
  private toZodSchema = weakMemoize<Schema, ZodSchema>(
    new WeakMap(),
    (schema) => evalZodSchema(resolveAllReferences(schema, this.rootSchema))
  );
  private _isFieldRequired = false;
  private _toFieldZodSchema = weakMemoize<Schema, ZodSchema>(
    new WeakMap(),
    (schema) =>
      evalZodSchema({
        type: "object",
        properties: {
          field: schema,
        },
        required: this._isFieldRequired ? FIELD_REQUIRED : FIELD_NOT_REQUIRED,
      })
  );

  private toFieldZodSchema(config: Config) {
    this._isFieldRequired = config.required;
    return this._toFieldZodSchema(config.schema);
  }

  constructor(
    private readonly zodSchema: ZodSchema,
    private readonly rootSchema: Schema,
    private readonly uiSchema: UiSchemaRoot = {},
    private readonly idPrefix: string = DEFAULT_ID_PREFIX,
    private readonly idSeparator: string = DEFAULT_ID_SEPARATOR
  ) {}

  validateFieldData(
    config: Config,
    fieldData: SchemaValue | undefined
  ): ValidationError<ZodIssue>[] {
    const instanceId = config.idSchema.$id;
    if (instanceId === this.idPrefix) {
      return this.validateFormData(config.schema, fieldData);
    }
    const schema = this.toFieldZodSchema(config);
    const result = schema.safeParse({ field: fieldData });
    if (result.success) {
      return NO_ERRORS;
    }
    return result.error.issues.map((issue) => {
      return {
        instanceId,
        propertyTitle: config.title,
        message: issue.message,
        error: issue,
      };
    });
  }

  isValid(
    schema: SchemaDefinition,
    _rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean {
    if (typeof schema === "boolean") {
      return schema;
    }
    const zodSchema = this.toZodSchema(schema);
    const result = zodSchema.safeParse(formData);
    return result.success;
  }

  reset(): void {}

  validateFormData(
    _rootSchema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<ZodIssue>[] {
    const result = this.zodSchema.safeParse(formData);
    if (result.success) {
      return NO_ERRORS;
    }
    return result.error.issues.map((issue) => {
      const instanceId = pathToId(this.idPrefix, this.idSeparator, issue.path);
      const propertyTitle =
        getValueByPath(this.uiSchema, issue.path)?.["ui:options"]?.title ??
        issue.path[issue.path.length - 1] ??
        instanceId;
      return {
        instanceId,
        propertyTitle,
        message: issue.message,
        error: issue,
      };
    });
  }
}
