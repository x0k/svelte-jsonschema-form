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
  DEFAULT_VALIDATOR_OPTIONS,
  type ValueCloner,
} from "../validator.svelte.js";

type FormatPredicate = NonNullable<BundleStandaloneOptions["formats"]>[string];

// `bundleStandalone` embeds a format predicate through `Function#toString`,
// so the function must not close over anything: the regular expressions are
// written out here instead of referencing `COLOR_FORMAT_REGEX` and
// `DATA_URL_FORMAT_REGEX`. They are kept equal by a test. Building the
// predicates with `new Function` was the previous way to inline them, but it
// ran at import time and throws where dynamic code is refused (a page under
// a Content-Security-Policy without `unsafe-eval`), which is the page a
// precompiled validator is for.
const PRECOMPILED_FORMATS = {
  color: (value: string) =>
    /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/.test(
      value
    ),
  [DATA_URL_FORMAT]: (value: string) =>
    /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/.test(value),
} satisfies Record<
  keyof (typeof DEFAULT_VALIDATOR_OPTIONS)["formats"],
  FormatPredicate
>;

export const DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS = {
  ...DEFAULT_VALIDATOR_OPTIONS,
  format: "esm",
  formats: PRECOMPILED_FORMATS,
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
