import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { DATA_URL_FORMAT } from "@sjsf/form/core";
import type { ValidationError } from "ata-validator";
import type { BundleStandaloneOptions } from "ata-validator/build";

import {
  createFormErrorsTransformer,
  transformFieldErrors,
} from "../errors.js";
import type { Schemas } from "../model.js";
import {
  COLOR_FORMAT_REGEX,
  DATA_URL_FORMAT_REGEX,
  DEFAULT_VALIDATOR_OPTIONS,
  type ValueCloner,
} from "../validator.svelte.js";

type FormatPredicate = NonNullable<BundleStandaloneOptions["formats"]>[string];

function createFormatPredicate(regExp: RegExp) {
  return new Function(
    "value",
    `return ${regExp}.test(value)`
  ) as FormatPredicate;
}

export const DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS = {
  ...DEFAULT_VALIDATOR_OPTIONS,
  format: "esm",
  formats: {
    color: createFormatPredicate(COLOR_FORMAT_REGEX),
    [DATA_URL_FORMAT]: createFormatPredicate(DATA_URL_FORMAT_REGEX),
  } satisfies Record<
    keyof (typeof DEFAULT_VALIDATOR_OPTIONS)["formats"],
    FormatPredicate
  >,
} satisfies BundleStandaloneOptions;

export type CompiledValidator = (data: unknown) =>
  // NOTE: The result has been extended to support
  // inferred types of precompiled functions
  | { valid: boolean; errors: ValidationError[] }
  | { valid: true; errors: ReadonlyArray<never> };

export type ValidateFunctions = {
  [key: string]: CompiledValidator;
};

type CoreValidatorOptions = {
  validatorRetriever: (schema: Schema) => CompiledValidator;
};

export type ValidatorOptions = ValueCloner & CoreValidatorOptions;

export function createValidator({
  validatorRetriever,
  cloneValue,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validator = validatorRetriever(schema);
      return validator(cloneValue(formValue)).valid;
    },
  };
}

export type FormValueValidatorOptions = ValidatorOptions &
  Schemas &
  ValueCloner;

export function createFormValueValidator<T>({
  schema,
  uiSchema = {},
  cloneValue,
  validatorRetriever,
}: FormValueValidatorOptions): FormValueValidator<T> {
  const validator = validatorRetriever(schema);
  const transformErrors = createFormErrorsTransformer(schema, uiSchema);
  return {
    validateFormValue(formValue) {
      const { valid, errors } = validator(cloneValue(formValue));
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

export function createFieldValueValidator({
  validatorRetriever,
  cloneValue,
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const validator = validatorRetriever(field.schema);
      const { valid, errors } = validator(cloneValue(fieldValue));
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
  vOptions: CoreValidatorOptions & Partial<ValueCloner>
) {
  return (options: Omit<FormValidatorOptions, keyof ValidatorOptions>) => {
    const full: FormValidatorOptions = {
      ...options,
      ...vOptions,
      cloneValue: vOptions.cloneValue ?? ((value) => $state.snapshot(value)),
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full)
    );
  };
}
