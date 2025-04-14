import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import type { AsyncValidateFunction, ErrorObject, ValidateFunction } from "ajv";

import {
  createFormErrorsTransformer,
  createFieldErrorsTransformer,
  type ErrorsTransformerOptions,
  validateAndTransformErrors,
  validateAndTransformErrorsAsync,
} from "../errors.js";

export type ValidateFunctions = {
  [key: string]: ValidateFunction;
};

export interface ValidatorOptions {
  validateFunctions: ValidateFunctions;
}

function getValidateFunction(
  { validateFunctions }: ValidatorOptions,
  { $id: id }: Schema
): ValidateFunction {
  if (id === undefined) {
    throw new Error("Schema id not found");
  }
  const validate = validateFunctions[id];
  if (validate === undefined) {
    throw new Error(`Validate function with id "${id}" not found`);
  }
  return validate;
}

export function createValidator(options: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validate = getValidateFunction(options, schema);
      try {
        return validate(formValue);
      } catch (e) {
        console.warn("Failed to validate", e);
        return false;
      }
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions,
    ErrorsTransformerOptions {}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator<ErrorObject> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      return validateAndTransformErrors(
        getValidateFunction(options, rootSchema),
        formValue,
        transformErrors
      );
    },
  };
}

export function createFieldValueValidator(
  options: ValidatorOptions
): FieldValueValidator<ErrorObject> {
  return {
    validateFieldValue(field, fieldValue) {
      return validateAndTransformErrors(
        getValidateFunction(options, field.schema),
        fieldValue,
        createFieldErrorsTransformer(field)
      );
    },
  };
}

export function createAsyncFormValueValidator(
  options: FormValidatorOptions
): AsyncFormValueValidator<ErrorObject> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValueAsync(_, rootSchema, formValue) {
      return validateAndTransformErrorsAsync(
        getValidateFunction(options, rootSchema) as AsyncValidateFunction,
        formValue,
        transformErrors
      );
    },
  };
}

export function createAsyncFieldValueValidator(
  options: ValidatorOptions
): AsyncFieldValueValidator<ErrorObject> {
  return {
    validateFieldValueAsync(_, field, fieldValue) {
      return validateAndTransformErrorsAsync(
        getValidateFunction(options, field.schema) as AsyncValidateFunction,
        fieldValue,
        createFieldErrorsTransformer(field)
      );
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions {}

export function createFormValidator(options: FormValidatorOptions) {
  return Object.assign(
    createValidator(options),
    createFormValueValidator(options),
    createFieldValueValidator(options)
  );
}

export function createAsyncFormValidator(options: FormValidatorOptions) {
  return Object.assign(
    createValidator(options),
    createAsyncFormValueValidator(options),
    createAsyncFieldValueValidator(options)
  );
}
