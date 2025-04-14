import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import type { ErrorObject, ValidateFunction } from "ajv";

import {
  createFormErrorsTransformer,
  isRootFieldError,
  transformFieldErrors,
  type ErrorsTransformerOptions,
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
      const validate = getValidateFunction(options, rootSchema);
      validate(formValue);
      const errors = validate.errors;
      validate.errors = null;
      if (!errors) {
        return [];
      }
      return transformErrors(errors);
    },
  };
}

export function createFieldValueValidator(
  options: ValidatorOptions
): FieldValueValidator<ErrorObject> {
  return {
    validateFieldValue(field, fieldValue) {
      const validate = getValidateFunction(options, field.schema);
      validate(fieldValue);
      const errors = validate.errors;
      validate.errors = null;
      if (!errors) {
        return [];
      }
      return transformFieldErrors(errors, field, isRootFieldError);
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
