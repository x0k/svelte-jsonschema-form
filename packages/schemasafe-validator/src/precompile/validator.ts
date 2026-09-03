import type { Json, ValidationError } from "@exodus/schemasafe";
import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import type { Merger } from "@sjsf/form/core";

import { transformFormErrors, transformFieldErrors } from "../errors.js";
import type { ValueToJSON } from "../validator.js";

export interface CompiledValidateFunction {
  (data: unknown): boolean;
  errors?: ValidationError[];
}

export type ValidateFunctions = {
  [key: string]: CompiledValidateFunction;
};

type CoreValidatorOptions = {
  validatorRetriever: (schema: Schema) => CompiledValidateFunction;
};

export type ValidatorOptions = ValueToJSON & CoreValidatorOptions;

export function createValidator({
  validatorRetriever,
  valueToJSON,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validate = validatorRetriever(schema);
      return validate(valueToJSON(formValue));
    },
  };
}

export type FormValueValidatorOptions = ValidatorOptions & {
  merger: () => Merger;
  schema: Schema;
};

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  const validate = options.validatorRetriever(options.schema);
  const validator = createValidator(options);
  return {
    validateFormValue(formValue) {
      validate(options.valueToJSON(formValue));
      return transformFormErrors(
        validator,
        options.merger(),
        options.schema,
        validate.errors,
        formValue
      );
    },
  };
}

export function createFieldValueValidator({
  validatorRetriever,
  valueToJSON,
}: ValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const validate = validatorRetriever(field.schema);
      validate(valueToJSON(fieldValue));
      return transformFieldErrors(field, validate.errors, fieldValue);
    },
  };
}

export type FormValidatorOptions = ValidatorOptions & FormValueValidatorOptions;

export function createFormValidatorFactory<T>(
  vOptions: CoreValidatorOptions & Partial<ValueToJSON>
) {
  return (
    options: Omit<
      FormValidatorOptions,
      keyof ValueToJSON | keyof CoreValidatorOptions
    >
  ) => {
    const full: FormValidatorOptions = {
      ...options,
      ...vOptions,
      // `isJSON` validator option is `false` by default
      valueToJSON: vOptions.valueToJSON ?? ((value) => value as Json),
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full)
    );
  };
}
