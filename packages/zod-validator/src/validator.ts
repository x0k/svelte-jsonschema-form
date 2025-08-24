import { z, type ZodIssue, type ZodSchema } from "zod";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import {
  resolveAllReferences,
  type Merger,
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
import { createMerger } from "@sjsf/form/mergers/modern";
import { jsonSchemaToZod } from "json-schema-to-zod";

import {
  createErrorsTransformer,
  transformFieldErrors,
  type ErrorsTransformerOptions,
} from "./errors.js";

export function evalZodSchema(schema: Schema) {
  return new Function("z", `return ${jsonSchemaToZod(schema)}`)(z);
}

export type MergerAccessor = () => Merger;

export function createZodSchemaFactory(merger: MergerAccessor) {
  const cache = new WeakMap<Schema, ZodSchema>();
  let lastRootSchema: Schema;
  const factory = weakMemoize<Schema, ZodSchema>(cache, (schema) =>
    evalZodSchema(resolveAllReferences(merger(), schema, lastRootSchema))
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
  const factory = weakMemoize<Schema, ZodSchema>(cache, evalZodSchema);
  return (config: Config) => factory(config.schema);
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
  const transform = createErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      return transform(options.zodSchema.safeParse(formValue), rootSchema);
    },
  };
}

export function createAsyncFormValueValidator(
  options: FormValueValidatorOptions
): AsyncFormValueValidator<ZodIssue> {
  const transform = createErrorsTransformer(options);
  return {
    async validateFormValueAsync(_signal, rootSchema, formValue) {
      const result = await options.zodSchema.safeParseAsync(formValue);
      return transform(result, rootSchema);
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
      const result = schema.safeParse(fieldValue);
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

function createMergerAccessor(): MergerAccessor {
  const merger = createMerger();
  return () => merger;
}

export function createFormValidator<Async extends boolean = false>(
  zodSchema: ZodSchema,
  {
    async,
    merger = createMergerAccessor(),
    createZodSchema = createZodSchemaFactory(merger),
    createFieldZodSchema = createFieldZodSchemaFactory(),
    ...rest
  }: Partial<Omit<FormValidatorOptions, "zodSchema">> & {
    async?: Async;
    merger?: MergerAccessor;
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
