import type { Json, Validate } from "@exodus/schemasafe";
import type { Merger } from "@sjsf/form/core";
import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { fromValidators } from "@sjsf/form/validators/precompile";

import type { ValueToJSON } from "../validator.js";
import { transformFormErrors, transformFieldErrors } from "../errors.js";

export type CompiledValidateFunction = (data: unknown) => boolean;

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

function createAndCastRetriever(options: CoreValidatorOptions) {
  return createRetriever(options) as (schema: Schema) => Validate;
}

export type ValidatorOptions = ValueToJSON & CoreValidatorOptions;

export function createValidator(options: ValidatorOptions): Validator {
  const getValidate = createRetriever(options);
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validate = getValidate(schema);
      return validate(options.valueToJSON(formValue));
    },
  };
}

export type FormValueValidatorOptions = ValidatorOptions & {
  merger: () => Merger;
};

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions,
): FormValueValidator<T> {
  const getValidate = createAndCastRetriever(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validate = getValidate(rootSchema);
      validate(options.valueToJSON(formValue));
      return transformFormErrors(
        createValidator(options),
        options.merger(),
        rootSchema,
        validate.errors,
        formValue,
      );
    },
  };
}

export function createFieldValueValidator(
  options: ValidatorOptions,
): FieldValueValidator {
  const getValidate = createAndCastRetriever(options);
  return {
    validateFieldValue(field, fieldValue) {
      const validate = getValidate(field.schema);
      validate(options.valueToJSON(fieldValue));
      return transformFieldErrors(field, validate.errors, fieldValue);
    },
  };
}

export type FormValidatorOptions = ValidatorOptions & FormValueValidatorOptions;

export function createFormValidatorFactory<T>(
  vOptions: CoreValidatorOptions & Partial<ValueToJSON>,
) {
  return (
    options: Omit<
      FormValidatorOptions,
      keyof ValueToJSON | keyof ValidatorOptions
    >,
  ) => {
    const full: FormValidatorOptions = {
      ...options,
      ...vOptions,
      validatorRetriever:
        vOptions.validatorRetriever ?? createRetriever(vOptions),
      // `isJSON` validator option is `false` by default
      valueToJSON: vOptions.valueToJSON ?? ((value) => value as Json),
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full),
    );
  };
}
