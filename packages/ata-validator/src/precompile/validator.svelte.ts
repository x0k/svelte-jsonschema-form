import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { DATA_URL_FORMAT } from "@sjsf/form/core";
import { fromValidators } from "@sjsf/form/validators/precompile";
import type { ValidationError } from "ata-validator";
import type { BundleStandaloneOptions } from "ata-validator/build";

import {
  createFormErrorsTransformer,
  transformFieldErrors,
  type ErrorsTransformerOptions,
} from "../errors.js";
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
            : undefined
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
  options: FormValueValidatorOptions
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
  options: FieldValueValidatorOptions
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
  vOptions: CoreValidatorOptions & Partial<ValueCloner>
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
      createFieldValueValidator(full)
    );
  };
}
