import { type SchemaDefinition, resolveAllReferences } from "@sjsf/form/core";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  type Config,
  type FormValidator2,
  type Schema,
  type SchemaValue,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import { z, type ZodIssue, type ZodSchema } from "zod";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { weakMemoize } from "@sjsf/form/lib/memoize";

import { makeFormDataValidationResultTransformer, NO_ERRORS } from './shared.js';

const FIELD_REQUIRED = ["field"];
const FIELD_NOT_REQUIRED: string[] = [];

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

export interface ValidatorOptions<Async extends boolean> {
  async: Async;
  schema: ZodSchema;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
  zodSchemaFactory?: (schema: Schema, rootSchema: Schema) => ZodSchema;
  fieldZodSchemaFactory?: (config: Config) => ZodSchema;
}

export type ValidationResult<Async extends boolean> = Async extends true
  ? Promise<ValidationError<ZodIssue>[]>
  : ValidationError<ZodIssue>[];

export class Validator<Async extends boolean>
  implements FormValidator2<ZodIssue>
{
  protected readonly async: Async;
  protected readonly zodSchema: ZodSchema;
  protected readonly uiSchema: UiSchemaRoot;
  protected readonly idPrefix: string;
  protected readonly idSeparator: string;
  protected readonly zodSchemaFactory: (
    schema: Schema,
    rootSchema: Schema
  ) => ZodSchema;
  protected readonly fieldZodSchemaFactory: (config: Config) => ZodSchema;
  protected readonly transformFormDataValidationResult: (
    result: z.SafeParseReturnType<any, any>
  ) => ValidationError<ZodIssue>[];
  constructor({
    async,
    schema,
    uiSchema = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    zodSchemaFactory = makeZodSchemaFactory(),
    fieldZodSchemaFactory = makeFieldZodSchemaFactory(),
  }: ValidatorOptions<Async>) {
    this.async = async;
    this.zodSchema = schema;
    this.uiSchema = uiSchema;
    this.idPrefix = idPrefix;
    this.idSeparator = idSeparator;
    this.zodSchemaFactory = zodSchemaFactory;
    this.fieldZodSchemaFactory = fieldZodSchemaFactory;
    this.transformFormDataValidationResult =
      makeFormDataValidationResultTransformer(idPrefix, idSeparator, uiSchema);
  }

  validateFieldData(
    config: Config,
    fieldData: SchemaValue | undefined
  ): ValidationResult<Async> {
    const instanceId = config.idSchema.$id;
    if (instanceId === this.idPrefix) {
      return this.validateFormData(config.schema, fieldData);
    }
    const schema = this.fieldZodSchemaFactory(config);
    const result = schema.safeParse({ field: fieldData });
    const transformed = this.transformFieldDataValidationResult(result, config);
    return (
      this.async ? Promise.resolve(transformed) : transformed
    ) as ValidationResult<Async>;
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
  ): ValidationResult<Async> {
    return (
      this.async
        ? this.zodSchema
            .safeParseAsync(formData)
            .then(this.transformFormDataValidationResult)
        : this.transformFormDataValidationResult(
            this.zodSchema.safeParse(formData)
          )
    ) as ValidationResult<Async>;
  }

  protected transformFieldDataValidationResult = (
    result: z.SafeParseReturnType<any, any>,
    config: Config
  ): ValidationError<ZodIssue>[] => {
    if (result.success) {
      return NO_ERRORS;
    }
    return result.error.issues.map((issue) => {
      return {
        instanceId: config.idSchema.$id,
        propertyTitle: config.title,
        message: issue.message,
        error: issue,
      };
    });
  };
}
