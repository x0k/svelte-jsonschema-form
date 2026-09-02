import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Validator,
} from "@sjsf/form";
import { createValidatorRetriever } from "@sjsf/form/validators/precompile";
import * as v from "valibot";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import type { SchemaRegistry } from "./model.js";

export interface SchemaRegistryProvider {
  schemaRegistry: SchemaRegistry;
}

export interface ValidatorOptions extends SchemaRegistryProvider {}

export function createValidator({
  schemaRegistry,
}: ValidatorOptions): Validator {
  const getValibotSchema = createValidatorRetriever({
    registry: schemaRegistry,
  });
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      return v.safeParse(getValibotSchema(schema), formValue).success;
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  const getValibotSchema = createValidatorRetriever({
    registry: options.schemaRegistry,
  });
  return {
    validateFormValue(rootSchema, formValue) {
      return transformFormErrors(
        v.safeParse(getValibotSchema(rootSchema), formValue),
        formValue
      );
    },
  };
}

export interface AsyncFormValueValidatorOptions extends SchemaRegistryProvider {}

export function createAsyncFormValueValidator<T>(
  options: AsyncFormValueValidatorOptions
): AsyncFormValueValidator<T> {
  const getValibotSchema = createValidatorRetriever({
    registry: options.schemaRegistry,
  });
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      const result = await v.safeParseAsync(
        getValibotSchema(rootSchema),
        formValue
      );
      return transformFormErrors(result, formValue);
    },
  };
}

export interface FieldValueValidatorOptions extends SchemaRegistryProvider {}

export function createFieldValueValidator({
  schemaRegistry,
}: FieldValueValidatorOptions): FieldValueValidator {
  const getValibotSchema = createValidatorRetriever({
    registry: schemaRegistry,
  });
  return {
    validateFieldValue(field, fieldValue) {
      const result = v.safeParse(getValibotSchema(field.schema), fieldValue);
      return transformFieldErrors(result);
    },
  };
}

export interface AsyncFieldValueValidatorOptions extends SchemaRegistryProvider {}

export function createAsyncFieldValueValidator({
  schemaRegistry,
}: AsyncFieldValueValidatorOptions): AsyncFieldValueValidator {
  const getValibotSchema = createValidatorRetriever({
    registry: schemaRegistry,
  });
  return {
    async validateFieldValueAsync(_, field, fieldValue) {
      const result = await v.safeParseAsync(
        getValibotSchema(field.schema),
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
