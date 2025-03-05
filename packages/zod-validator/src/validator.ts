import { z, type ZodIssue, type ZodSchema } from "zod";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import {
  resolveAllReferences,
  type Schema,
  type Validator,
} from "@sjsf/form/core";
import {
  type AsyncFieldValueValidator,
  type AsyncFormValueValidator,
  type Config,
  type FieldValueValidator,
  type FormValueValidator,
} from "@sjsf/form";
import { jsonSchemaToZod } from "json-schema-to-zod";

import {
  createErrorsTransformer,
  transformFieldErrors,
  type ErrorsTransformerOptions,
} from "./errors.js";

const FIELD_REQUIRED = ["field"];
const FIELD_NOT_REQUIRED: string[] = [];

export function evalZodSchema(schema: Schema) {
  return new Function("z", `return ${jsonSchemaToZod(schema)}`)(z);
}

export function createZodSchemaFactory() {
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

export function createFieldZodSchemaFactory() {
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
  createZodSchema: (schema: Schema, rootSchema: Schema) => ZodSchema;
}

export function createValidator({
  createZodSchema,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, rootSchema, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const zodSchema = createZodSchema(schema, rootSchema);
      return zodSchema.safeParse(formValue).success;
    },
  };
}

export interface FormValueValidatorOptions extends ErrorsTransformerOptions {
  zodSchema: ZodSchema;
}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator<ZodIssue> {
  return {
    validateFormValue(_, formValue) {
      const transform = createErrorsTransformer(options);
      return transform(options.zodSchema.safeParse(formValue));
    },
  };
}

export function createAsyncFormValueValidator(
  options: FormValueValidatorOptions
): AsyncFormValueValidator<ZodIssue> {
  return {
    async validateFormValueAsync(_signal, _rootSchema, formValue) {
      const transform = createErrorsTransformer(options);
      const result = await options.zodSchema.safeParseAsync(formValue);
      return transform(result);
    },
  };
}

export interface FieldValueValidatorOptions {
  createFieldZodSchema: (config: Config) => ZodSchema;
}

export function createFieldValueValidator({
  createFieldZodSchema,
}: FieldValueValidatorOptions): FieldValueValidator<ZodIssue> {
  return {
    validateFieldValue(config, fieldValue) {
      const schema = createFieldZodSchema(config);
      const result = schema.safeParse({ field: fieldValue });
      return transformFieldErrors(config, result);
    },
  };
}

export function createAsyncFieldValueValidator({
  createFieldZodSchema,
}: FieldValueValidatorOptions): AsyncFieldValueValidator<ZodIssue> {
  return {
    async validateFieldValueAsync(_signal, config, fieldValue) {
      const schema = createFieldZodSchema(config);
      const result = await schema.safeParseAsync(fieldValue);
      return transformFieldErrors(config, result);
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export type ZodFormValidator = Validator &
  FormValueValidator<ZodIssue> &
  FieldValueValidator<ZodIssue>;

export type AsyncZodFormValidator = Validator &
  AsyncFormValueValidator<ZodIssue> &
  AsyncFieldValueValidator<ZodIssue>;

export function createFormValidator<Async extends boolean = false>(
  zodSchema: ZodSchema,
  {
    async,
    createZodSchema = createZodSchemaFactory(),
    createFieldZodSchema = createFieldZodSchemaFactory(),
    ...rest
  }: Partial<Omit<FormValidatorOptions, "zodSchema">> & {
    async?: Async;
  } = {}
) {
  const options: FormValidatorOptions = {
    ...rest,
    zodSchema,
    createZodSchema,
    createFieldZodSchema,
  };
  const validator = createValidator(options);
  return (
    async
      ? (Object.assign(
          validator,
          createAsyncFormValueValidator(options),
          createAsyncFieldValueValidator(options)
        ) satisfies AsyncZodFormValidator)
      : (Object.assign(
          validator,
          createFormValueValidator(options),
          createFieldValueValidator(options)
        ) satisfies ZodFormValidator)
  ) as Async extends true ? AsyncZodFormValidator : ZodFormValidator;
}
