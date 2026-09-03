import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import type { AsyncValidateFunction } from "ajv";

import {
  createFormErrorsTransformer,
  createFieldErrorsTransformer,
  validateAndTransformErrors,
  validateAndTransformErrorsAsync,
} from "../errors.js";
import {
  CAST_FORM_DATA,
  NO_FILED_ERRORS,
  type CompiledValidateFunction,
} from "../internals.js";
import type { Schemas } from "../model.js";

export type ValidateFunctions = {
  [key: string]: CompiledValidateFunction;
};

export type ValidatorOptions = {
  validatorRetriever: (schema: Schema) => CompiledValidateFunction;
};

export function createValidator({
  validatorRetriever,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      try {
        return validatorRetriever(schema)(formValue);
      } catch (e) {
        console.warn("Failed to validate", e);
        return false;
      }
    },
  };
}

export type FormValueValidatorOptions = ValidatorOptions & Schemas;

export function createFormValueValidator<T>({
  validatorRetriever,
  schema,
  uiSchema = {},
}: FormValueValidatorOptions): FormValueValidator<T> {
  const validate = validatorRetriever(schema);
  const transformErrors = createFormErrorsTransformer(schema, uiSchema);
  return {
    validateFormValue(formValue) {
      return validateAndTransformErrors(
        validate,
        formValue,
        CAST_FORM_DATA<T>,
        transformErrors
      );
    },
  };
}

export function createFieldValueValidator({
  validatorRetriever,
}: ValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      return validateAndTransformErrors(
        validatorRetriever(field.schema),
        fieldValue,
        NO_FILED_ERRORS,
        createFieldErrorsTransformer(field)
      );
    },
  };
}

export function createAsyncFormValueValidator<T>({
  validatorRetriever,
  schema,
  uiSchema = {},
}: FormValueValidatorOptions): AsyncFormValueValidator<T> {
  const validateAsync = validatorRetriever(schema) as AsyncValidateFunction;
  const transformErrors = createFormErrorsTransformer(schema, uiSchema);
  return {
    validateFormValueAsync(_, formValue) {
      return validateAndTransformErrorsAsync(
        validateAsync,
        formValue,
        CAST_FORM_DATA<T>,
        transformErrors
      );
    },
  };
}

export function createAsyncFieldValueValidator({
  validatorRetriever,
}: ValidatorOptions): AsyncFieldValueValidator {
  return {
    validateFieldValueAsync(_, field, fieldValue) {
      return validateAndTransformErrorsAsync(
        validatorRetriever(field.schema) as AsyncValidateFunction,
        fieldValue,
        NO_FILED_ERRORS,
        createFieldErrorsTransformer(field)
      );
    },
  };
}

export type FormValidatorOptions = ValidatorOptions & FormValueValidatorOptions;

export function createFormValidatorFactory<T>(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = { ...options, ...vOptions };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full)
    );
  };
}

export function createAsyncFormValidatorFactory<T>(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = { ...options, ...vOptions };
    return Object.assign(
      createValidator(full),
      createAsyncFormValueValidator<T>(full),
      createAsyncFieldValueValidator(full)
    );
  };
}
