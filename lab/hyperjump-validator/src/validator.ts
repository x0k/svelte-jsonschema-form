import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  Validator,
} from "@sjsf/form";
import type { Localization } from "@hyperjump/json-schema-errors";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import { createContext, validate, type ValidatorOptions } from "./model.js";

export function createValidator(options: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      return validate(createContext(options, schema, formValue)).valid;
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {}

export function createAsyncFormValueValidator<T>(
  options: FormValueValidatorOptions,
): AsyncFormValueValidator<T> {
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      const ctx = createContext(options, rootSchema, formValue);
      const out = validate(ctx);
      return await transformFormErrors(
        ctx,
        rootSchema,
        formValue,
        out,
        options.localization,
      );
    },
  };
}

export function createAsyncFieldValueValidator(
  options: FormValidatorOptions,
): AsyncFieldValueValidator {
  return {
    async validateFieldValueAsync(_, field, fieldValue) {
      const ctx = createContext(options, field.schema, fieldValue);
      const out = validate(ctx);
      return await transformFieldErrors(
        ctx,
        field.schema,
        out,
        options.localization,
      );
    },
  };
}

export interface FormValidatorOptions extends FormValueValidatorOptions {}

export function createAsyncFormValidatorFactory<T>(vOptions: ValidatorOptions) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = {
      ...vOptions,
      ...options,
    };
    return Object.assign(
      createValidator(full),
      createAsyncFormValueValidator<T>(full),
      createAsyncFieldValueValidator(full),
    );
  };
}
