import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { fromValidators } from "@sjsf/form/validators/precompile";
import type { ValidationResult as AtaValidationResult } from "ata-validator";

import type { ValueCloner } from "../validator.svelte.js";
import {
  createFormErrorsTransformer,
  transformFieldErrors,
  type ErrorsTransformerOptions,
} from "../errors.js";

export type CompiledValidator = (
  data: unknown,
) => AtaValidationResult | { valid: true; errors: ReadonlyArray<never> };

export type ValidateFunctions = {
  [key: string]: CompiledValidator;
};

// TODO: Remove in v4
interface LegacyValidatorOptions {
  /** @deprecated use `validatorRetriever` instead */
  validateFunctions: ValidateFunctions;
  /** @deprecated use `validatorRetriever` instead */
  augmentSuffix?: string;
  validatorRetriever?: (schema: Schema) => CompiledValidator;
}

interface ModernValidatorOptions {
  validatorRetriever: (schema: Schema) => CompiledValidator;
}

type CoreValidatorOptions = LegacyValidatorOptions | ModernValidatorOptions;

// TODO: Remove in v4
function createRetriever(options: CoreValidatorOptions) {
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

export type ValidatorOptions = ValueCloner & CoreValidatorOptions;

export function createValidator(options: ValidatorOptions): Validator {
  const getValidator = createRetriever(options);
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validator = getValidator(schema);
      return validator(options.cloneValue(formValue)).valid;
    },
  };
}

export type FormValueValidatorOptions = ValidatorOptions &
  ErrorsTransformerOptions &
  ValueCloner;

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions,
): FormValueValidator<T> {
  const getValidator = createRetriever(options);
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = getValidator(rootSchema);
      const { valid, errors } = validator(options.cloneValue(formValue));
      if (valid) {
        return {
          value: formValue as T,
        };
      }
      return transformErrors(errors, formValue);
    },
  };
}

export type FieldValueValidatorOptions = ValidatorOptions & ValueCloner;

export function createFieldValueValidator(
  options: FieldValueValidatorOptions,
): FieldValueValidator {
  const getValidator = createRetriever(options);
  return {
    validateFieldValue(field, fieldValue) {
      const validator = getValidator(field.schema);
      const { valid, errors } = validator(options.cloneValue(fieldValue));
      if (valid) {
        return [];
      }
      return transformFieldErrors(field, errors);
    },
  };
}

export type FormValidatorOptions = ValidatorOptions &
  FormValueValidatorOptions &
  FieldValueValidatorOptions;

export function createFormValidatorFactory<T>(
  vOptions: CoreValidatorOptions & Partial<ValueCloner>,
) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = {
      ...options,
      ...vOptions,
      validatorRetriever:
        vOptions.validatorRetriever ?? createRetriever(vOptions),
      cloneValue: vOptions.cloneValue ?? ((value) => $state.snapshot(value)),
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full),
    );
  };
}
