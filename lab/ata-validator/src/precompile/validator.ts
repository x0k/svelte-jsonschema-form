import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { DEFAULT_AUGMENT_SUFFIX } from "@sjsf/form/validators/precompile";
import type { ValidationResult as AtaValidationResult } from "ata-validator";
import {
  createFormErrorsTransformer,
  transformFieldErrors,
  type ErrorsTransformerOptions,
} from "../errors.js";

export type CompiledValidator = (data: unknown) => AtaValidationResult;

export type ValidateFunctions = {
  [key: string]: CompiledValidator;
};

export interface ValidatorOptions {
  validateFunctions: ValidateFunctions;
  augmentSuffix?: string;
}

function getValidator(
  {
    validateFunctions,
    augmentSuffix = DEFAULT_AUGMENT_SUFFIX,
  }: ValidatorOptions,
  { $id: id, allOf }: Schema,
): CompiledValidator {
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
  const validator = validateFunctions[id];
  if (validator === undefined) {
    throw new Error(`Validate function with id "${id}" not found`);
  }
  return validator;
}

export function createValidator(options: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validator = getValidator(options, schema);
      return validator(formValue).valid;
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions, ErrorsTransformerOptions {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions,
): FormValueValidator<T> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = getValidator(options, rootSchema);
      const { valid, errors } = validator(formValue);
      if (valid) {
        return {
          value: formValue as T,
        };
      }
      return transformErrors(errors, formValue);
    },
  };
}

export interface FieldValueValidatorOptions extends ValidatorOptions {}

export function createFieldValueValidator(
  options: FieldValueValidatorOptions,
): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const validator = getValidator(options, field.schema);
      const { valid, errors } = validator(fieldValue);
      if (valid) {
        return [];
      }
      return transformFieldErrors(field, errors);
    },
  };
}

export interface FormValidatorOptions
  extends
    ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidatorFactory<T>(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full = {
      ...vOptions,
      ...options,
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full),
    );
  };
}
