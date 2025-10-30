import type { Ajv, AsyncValidateFunction, ValidateFunction } from "ajv";
import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { DEFAULT_AUGMENT_SUFFIX } from "@sjsf/form/validators/precompile";

import {
  createFormErrorsTransformer,
  createFieldErrorsTransformer,
  type ErrorsTransformerOptions,
  validateAndTransformErrors,
  validateAndTransformErrorsAsync,
} from "../errors.js";
import { CAST_FORM_DATA, NO_FILED_ERRORS } from '../internals.js';

export type CompiledValidateFunction = {
  (this: Ajv | any, data: any): boolean;
} & Pick<ValidateFunction, "errors">;

export type ValidateFunctions = {
  [key: string]: CompiledValidateFunction;
};

export interface ValidatorOptions {
  validateFunctions: ValidateFunctions;
  augmentSuffix?: string;
}

function getValidateFunction(
  {
    validateFunctions,
    augmentSuffix = DEFAULT_AUGMENT_SUFFIX,
  }: ValidatorOptions,
  { $id: id, allOf }: Schema
): ValidateFunction {
  if (id === undefined) {
    const firstAllOfItem = allOf?.[0];
    if (
      typeof firstAllOfItem === "object" &&
      firstAllOfItem.$id !== undefined
    ) {
      id = firstAllOfItem.$id + augmentSuffix;
    } else {
      throw new Error("Schema id not found");
    }
  }
  const validate = validateFunctions[id];
  if (validate === undefined) {
    throw new Error(`Validate function with id "${id}" not found`);
  }
  return validate as ValidateFunction;
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

export function createFormValueValidator<I, O>(
  options: FormValueValidatorOptions
): FormValueValidator<I, O> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      return validateAndTransformErrors(
        getValidateFunction(options, rootSchema),
        formValue,
        CAST_FORM_DATA<O>,
        transformErrors
      );
    },
  };
}

export function createFieldValueValidator(
  options: ValidatorOptions
): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      return validateAndTransformErrors(
        getValidateFunction(options, field.schema),
        fieldValue,
        NO_FILED_ERRORS,
        createFieldErrorsTransformer(field)
      );
    },
  };
}

export function createAsyncFormValueValidator<I, O>(
  options: FormValidatorOptions
): AsyncFormValueValidator<I, O> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValueAsync(_, rootSchema, formValue) {
      return validateAndTransformErrorsAsync(
        getValidateFunction(options, rootSchema) as AsyncValidateFunction,
        formValue,
        CAST_FORM_DATA<O>,
        transformErrors
      );
    },
  };
}

export function createAsyncFieldValueValidator(
  options: ValidatorOptions
): AsyncFieldValueValidator {
  return {
    validateFieldValueAsync(_, field, fieldValue) {
      return validateAndTransformErrorsAsync(
        getValidateFunction(options, field.schema) as AsyncValidateFunction,
        fieldValue,
        NO_FILED_ERRORS,
        createFieldErrorsTransformer(field)
      );
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions {}

export function createFormValidatorFactory(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full = {
      ...vOptions,
      ...options,
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator(full),
      createFieldValueValidator(full)
    );
  };
}

export function createAsyncFormValidatorFactory(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full = {
      ...vOptions,
      ...options,
    };
    return Object.assign(
      createValidator(full),
      createAsyncFormValueValidator(full),
      createAsyncFieldValueValidator(full)
    );
  };
}
