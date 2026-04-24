import type {
  FieldValueValidator,
  FormValueValidator,
  Validator,
} from "@sjsf/form";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import {
  createContext,
  evaluateCompiledSchema,
  validate,
  type ValidatorOptions,
} from "./model.js";

export function createValidator(options: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const ctx = createContext(options, schema, formValue);
      return validate(ctx);
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions,
): FormValueValidator<T> {
  return {
    validateFormValue(rootSchema, formValue) {
      const ctx = createContext(options, rootSchema, formValue);
      const out = evaluateCompiledSchema(ctx, options.localization);
      return transformFormErrors(out, formValue);
    },
  };
}

export function createFieldValueValidator(
  options: FormValidatorOptions,
): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const ctx = createContext(options, field.schema, fieldValue);
      const out = evaluateCompiledSchema(ctx, options.localization);
      return transformFieldErrors(out);
    },
  };
}

export interface FormValidatorOptions extends FormValueValidatorOptions {}

export function createFormValidatorFactory<T>(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = {
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
