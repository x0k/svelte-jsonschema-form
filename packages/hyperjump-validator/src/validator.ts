import type {
  FieldValueValidator,
  FormValue,
  FormValueValidator,
  Validator,
} from "@sjsf/form";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import {
  createContext,
  evaluate,
  validate,
  type CoreValidatorOptions,
  type ValidatorOptions,
  type ValueToJSON,
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

export type FormValueValidatorOptions = ValidatorOptions;

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  return {
    validateFormValue(rootSchema, formValue) {
      const ctx = createContext(options, rootSchema, formValue);
      const out = evaluate(ctx, options);
      return transformFormErrors(out, formValue);
    },
  };
}

export type FieldValueValidatorOptions = ValidatorOptions;

export function createFieldValueValidator(
  options: FieldValueValidatorOptions
): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const ctx = createContext(options, field.schema, fieldValue);
      const out = evaluate(ctx, options);
      return transformFieldErrors(out);
    },
  };
}

export type FormValidatorOptions = ValidatorOptions &
  FormValueValidatorOptions &
  FieldValueValidatorOptions;

export function createFormValidatorFactory<T>(
  vOptions: CoreValidatorOptions & Partial<ValueToJSON>
) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = {
      ...options,
      ...vOptions,
      valueToJSON:
        vOptions.valueToJSON ??
        ((v: FormValue) =>
          v === undefined || v === null
            ? null
            : typeof v === "object"
              ? JSON.parse(JSON.stringify(v))
              : v),
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full)
    );
  };
}
