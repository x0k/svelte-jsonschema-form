import type { AsyncValidateFunction } from "ajv";
import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { fromValidators } from "@sjsf/form/validators/precompile";

import {
  createFormErrorsTransformer,
  createFieldErrorsTransformer,
  type ErrorsTransformerOptions,
  validateAndTransformErrors,
  validateAndTransformErrorsAsync,
} from "../errors.js";
import {
  CAST_FORM_DATA,
  NO_FILED_ERRORS,
  type CompiledValidateFunction,
} from "../internals.js";

export type ValidateFunctions = {
  [key: string]: CompiledValidateFunction;
};

// TODO: Remove in v4
interface LegacyValidatorOptions {
  /** @deprecated use `validatorRetriever` instead */
  validateFunctions: ValidateFunctions;
  /** @deprecated use `validatorRetriever` instead */
  augmentSuffix?: string;
  validatorRetriever?: (schema: Schema) => CompiledValidateFunction;
}

interface ModernValidatorOptions {
  validatorRetriever: (schema: Schema) => CompiledValidateFunction;
}

export type ValidatorOptions = LegacyValidatorOptions | ModernValidatorOptions;

// TODO: Remove in v4
function createRetriever(options: ValidatorOptions) {
  return "validateFunctions" in options
    ? (options.validatorRetriever ??
        fromValidators(
          options.validateFunctions,
          options.augmentSuffix
            ? {
                idAugmentations: {
                  combination: (id) => id + options.augmentSuffix,
                },
              }
            : undefined,
        ))
    : options.validatorRetriever;
}

export function createValidator(options: ValidatorOptions): Validator {
  const getValidateFunction = createRetriever(options);
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validate = getValidateFunction(schema);
      try {
        return validate(formValue);
      } catch (e) {
        console.warn("Failed to validate", e);
        return false;
      }
    },
  };
}

export type FormValueValidatorOptions = ValidatorOptions &
  ErrorsTransformerOptions;

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions,
): FormValueValidator<T> {
  const getValidateFunction = createRetriever(options);
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      return validateAndTransformErrors(
        getValidateFunction(rootSchema),
        formValue,
        CAST_FORM_DATA<T>,
        transformErrors,
      );
    },
  };
}

export function createFieldValueValidator(
  options: ValidatorOptions,
): FieldValueValidator {
  const getValidateFunction = createRetriever(options);
  return {
    validateFieldValue(field, fieldValue) {
      return validateAndTransformErrors(
        getValidateFunction(field.schema),
        fieldValue,
        NO_FILED_ERRORS,
        createFieldErrorsTransformer(field),
      );
    },
  };
}

export function createAsyncFormValueValidator<T>(
  options: FormValidatorOptions,
): AsyncFormValueValidator<T> {
  const getValidateFunction = createRetriever(options);
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValueAsync(_, rootSchema, formValue) {
      return validateAndTransformErrorsAsync(
        getValidateFunction(rootSchema) as AsyncValidateFunction,
        formValue,
        CAST_FORM_DATA<T>,
        transformErrors,
      );
    },
  };
}

export function createAsyncFieldValueValidator(
  options: ValidatorOptions,
): AsyncFieldValueValidator {
  const getValidateFunction = createRetriever(options);
  return {
    validateFieldValueAsync(_, field, fieldValue) {
      return validateAndTransformErrorsAsync(
        getValidateFunction(field.schema) as AsyncValidateFunction,
        fieldValue,
        NO_FILED_ERRORS,
        createFieldErrorsTransformer(field),
      );
    },
  };
}

export type FormValidatorOptions = ValidatorOptions & FormValueValidatorOptions;

export function createFormValidatorFactory<T>(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = {
      ...options,
      ...vOptions,
      validatorRetriever:
        vOptions.validatorRetriever ?? createRetriever(vOptions),
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full),
    );
  };
}

export function createAsyncFormValidatorFactory<T>(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = {
      ...options,
      ...vOptions,
      validatorRetriever:
        vOptions.validatorRetriever ?? createRetriever(vOptions),
    };
    return Object.assign(
      createValidator(full),
      createAsyncFormValueValidator<T>(full),
      createAsyncFieldValueValidator(full),
    );
  };
}
