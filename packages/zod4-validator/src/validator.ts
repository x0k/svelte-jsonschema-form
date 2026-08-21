import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Validator,
} from "@sjsf/form";
import { createValidatorRetriever } from "@sjsf/form/validators/precompile";
import type { $ZodTypes, util } from "zod/v4/core";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import type { SchemaProvider, SchemaRegistry } from "./model.js";

export interface SchemaRegistryProvider {
  schemaRegistry: SchemaRegistry;
}

export interface SafeParseProvider {
  safeParse: (schema: $ZodTypes, value: unknown) => util.SafeParseResult<any>;
}

export interface SafeParseAsyncProvider {
  safeParseAsync: (
    schema: $ZodTypes,
    value: unknown
  ) => Promise<util.SafeParseResult<any>>;
}

export interface ValidatorOptions
  extends SchemaRegistryProvider, SafeParseProvider {}

export function createValidator({
  schemaRegistry,
  safeParse,
}: ValidatorOptions): Validator {
  const getZodSchema = createValidatorRetriever({ registry: schemaRegistry });
  return {
    isValid(schema, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      return safeParse(getZodSchema(schema), formValue).success;
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions, SchemaProvider {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  const getZodSchema = createValidatorRetriever({
    registry: options.schemaRegistry,
  });
  return {
    validateFormValue(formValue) {
      return transformFormErrors(
        options.safeParse(getZodSchema(options.schema), formValue),
        formValue
      );
    },
  };
}

export interface AsyncFormValueValidatorOptions
  extends SchemaRegistryProvider, SafeParseAsyncProvider, SchemaProvider {}

export function createAsyncFormValueValidator<T>(
  options: AsyncFormValueValidatorOptions
): AsyncFormValueValidator<T> {
  const getZodSchema = createValidatorRetriever({
    registry: options.schemaRegistry,
  });
  return {
    async validateFormValueAsync(_, formValue) {
      const result = await options.safeParseAsync(
        getZodSchema(options.schema),
        formValue
      );
      return transformFormErrors(result, formValue);
    },
  };
}

export interface FieldValueValidatorOptions
  extends SchemaRegistryProvider, SafeParseProvider {}

export function createFieldValueValidator({
  schemaRegistry,
  safeParse,
}: FieldValueValidatorOptions): FieldValueValidator {
  const getZodSchema = createValidatorRetriever({ registry: schemaRegistry });
  return {
    validateFieldValue(field, fieldValue) {
      const result = safeParse(getZodSchema(field.schema), fieldValue);
      return transformFieldErrors(result);
    },
  };
}

export interface AsyncFieldValueValidatorOptions
  extends SchemaRegistryProvider, SafeParseAsyncProvider {}

export function createAsyncFieldValueValidator({
  schemaRegistry,
  safeParseAsync,
}: AsyncFieldValueValidatorOptions): AsyncFieldValueValidator {
  const getZodSchema = createValidatorRetriever({ registry: schemaRegistry });
  return {
    async validateFieldValueAsync(_, field, fieldValue) {
      const result = await safeParseAsync(
        getZodSchema(field.schema),
        fieldValue
      );
      return transformFieldErrors(result);
    },
  };
}

export interface FormValidatorOptions
  extends
    ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator<T>(options: FormValidatorOptions) {
  return Object.assign(
    createValidator(options),
    createFormValueValidator<T>(options),
    createFieldValueValidator(options)
  );
}

export interface AsyncFormValidatorOptions
  extends
    ValidatorOptions,
    AsyncFormValueValidatorOptions,
    AsyncFieldValueValidatorOptions {}

export function createAsyncFormValidator<T>(
  options: AsyncFormValidatorOptions
) {
  return Object.assign(
    createValidator(options),
    createAsyncFormValueValidator<T>(options),
    createAsyncFieldValueValidator(options)
  );
}
