import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import type { $ZodIssue, $ZodTypes, util } from "zod/v4/core";

import { createAugmentedId, type SchemaRegistry } from "./model.js";
import { transformFormErrors, transformFieldErrors } from "./errors.js";

function getZodSchema(registry: SchemaRegistry, { $id: id, allOf }: Schema) {
  if (id === undefined) {
    const firstAllOfItem = allOf?.[0];
    if (
      typeof firstAllOfItem === "object" &&
      firstAllOfItem.$id !== undefined
    ) {
      id = createAugmentedId(firstAllOfItem.$id);
    } else {
      throw new Error("Schema id not found");
    }
  }
  const zodSchema = registry.get(id);
  if (zodSchema === undefined) {
    throw new Error(`Zod schema with id "${id}" not found`);
  }
  return zodSchema;
}

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
  extends SchemaRegistryProvider,
    SafeParseProvider {}

export function createValidator({
  schemaRegistry,
  safeParse,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const zodSchema = getZodSchema(schemaRegistry, schema);
      return safeParse(zodSchema, formValue).success;
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  return {
    validateFormValue(rootSchema, formValue) {
      const zodSchema = getZodSchema(options.schemaRegistry, rootSchema);
      return transformFormErrors(
        options.safeParse(zodSchema, formValue),
        formValue
      );
    },
  };
}

export interface AsyncFormValueValidatorOptions
  extends SchemaRegistryProvider,
    SafeParseAsyncProvider {}

export function createAsyncFormValueValidator<T>(
  options: AsyncFormValueValidatorOptions
): AsyncFormValueValidator<T> {
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      const zodSchema = getZodSchema(options.schemaRegistry, rootSchema);
      const result = await options.safeParseAsync(zodSchema, formValue);
      return transformFormErrors(result, formValue);
    },
  };
}

export interface FieldValueValidatorOptions
  extends SchemaRegistryProvider,
    SafeParseProvider {}

export function createFieldValueValidator({
  schemaRegistry,
  safeParse,
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const zodSchema = getZodSchema(schemaRegistry, field.schema);
      const result = safeParse(zodSchema, fieldValue);
      return transformFieldErrors(result);
    },
  };
}

export interface AsyncFieldValueValidatorOptions
  extends SchemaRegistryProvider,
    SafeParseAsyncProvider {}

export function createAsyncFieldValueValidator({
  schemaRegistry,
  safeParseAsync,
}: AsyncFieldValueValidatorOptions): AsyncFieldValueValidator {
  return {
    async validateFieldValueAsync(_, field, fieldValue) {
      const zodSchema = getZodSchema(schemaRegistry, field.schema);
      const result = await safeParseAsync(zodSchema, fieldValue);
      return transformFieldErrors(result);
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
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
  extends ValidatorOptions,
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
