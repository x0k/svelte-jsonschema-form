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

export function evalZodSchema(schema: Schema) {
  return new Function("z", `return ${jsonSchemaToZod(schema)}`)(z);
}

export function makeZodSchemaFactory() {
  const cache = new WeakMap<Schema, ZodSchema>();
  let lastRootSchema: Schema;
  const factory = weakMemoize<Schema, ZodSchema>(cache, (schema) =>
    evalZodSchema(resolveAllReferences(schema, lastRootSchema))
  );
  return (schema: Schema, rootSchema: Schema) => {
    if (lastRootSchema !== rootSchema) {
      lastRootSchema = rootSchema;
      cache.delete(schema);
    }
    return factory(schema);
  };
}

export function makeFieldZodSchemaFactory() {
  const cache = new WeakMap<Schema, ZodSchema>();
  const requiredCache = new WeakMap<Schema, boolean>();
  let isRequired = false;
  const factory = weakMemoize<Schema, ZodSchema>(cache, (schema) =>
    evalZodSchema({
      type: "object",
      properties: {
        field: schema,
      },
      required: isRequired ? FIELD_REQUIRED : FIELD_NOT_REQUIRED,
    })
  );
  return (config: Config) => {
    isRequired = config.required;
    const prev = requiredCache.get(config.schema);
    if (prev !== isRequired) {
      requiredCache.set(config.schema, isRequired);
      cache.delete(config.schema);
    }
    return factory(config.schema);
  };
}

export interface ValidatorOptions {
  schema: ZodSchema;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
  zodSchemaFactory?: (schema: Schema, rootSchema: Schema) => ZodSchema;
  fieldZodSchemaFactory?: (config: Config) => ZodSchema;
}

export class Validator implements FormValidator<ZodIssue> {
  private readonly zodSchema: ZodSchema;
  private readonly uiSchema: UiSchemaRoot;
  private readonly idPrefix: string;
  private readonly idSeparator: string;
  private readonly zodSchemaFactory: (schema: Schema, rootSchema: Schema) => ZodSchema;
  private readonly fieldZodSchemaFactory: (config: Config) => ZodSchema;
  constructor({
    schema,
    uiSchema = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    zodSchemaFactory = makeZodSchemaFactory(),
    fieldZodSchemaFactory = makeFieldZodSchemaFactory(),
  }: ValidatorOptions) {
    this.zodSchema = schema;
    this.uiSchema = uiSchema;
    this.idPrefix = idPrefix;
    this.idSeparator = idSeparator;
    this.zodSchemaFactory = zodSchemaFactory;
    this.fieldZodSchemaFactory = fieldZodSchemaFactory;
  }

  validateFieldData(
    config: Config,
    fieldData: SchemaValue | undefined
  ): ValidationError<ZodIssue>[] {
    const instanceId = config.idSchema.$id;
    if (instanceId === this.idPrefix) {
      return this.validateFormData(config.schema, fieldData);
    }
    const schema = this.fieldZodSchemaFactory(config);
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
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean {
    if (typeof schema === "boolean") {
      return schema;
    }
    const zodSchema = this.zodSchemaFactory(schema, rootSchema);
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
