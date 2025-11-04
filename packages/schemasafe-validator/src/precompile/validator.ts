import type { Json, Validate } from "@exodus/schemasafe";
import type { Merger } from "@sjsf/form/core";
import type {
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { DEFAULT_AUGMENT_SUFFIX } from "@sjsf/form/validators/precompile";

import type { ValueToJSON } from "../validator.js";
import { transformFormErrors, transformFieldErrors } from "../errors.js";

export type CompiledValidateFunction = (data: unknown) => boolean;

export type ValidateFunctions = {
  [key: string]: CompiledValidateFunction;
};

export interface ValidatorOptions extends ValueToJSON {
  validateFunctions: ValidateFunctions;
  augmentSuffix?: string;
}

function getValidate(
  {
    validateFunctions,
    augmentSuffix = DEFAULT_AUGMENT_SUFFIX,
  }: ValidatorOptions,
  { $id: id, allOf }: Schema
): Validate {
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
  const validate = validateFunctions[id];
  if (validate === undefined) {
    throw new Error(`Validate function with id "${id}" not found`);
  }
  return validate as Validate;
}

export function createValidator(options: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validate = getValidate(options, schema);
      return validate(options.valueToJSON(formValue));
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {
  merger: () => Merger;
}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  return {
    validateFormValue(rootSchema, formValue) {
      const validate = getValidate(options, rootSchema);
      validate(options.valueToJSON(formValue));
      return transformFormErrors(
        createValidator(options),
        options.merger(),
        rootSchema,
        validate.errors,
        formValue
      );
    },
  };
}

export function createFieldValueValidator(
  options: ValidatorOptions
): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const validate = getValidate(options, field.schema);
      validate(options.valueToJSON(fieldValue));
      return transformFieldErrors(field, validate.errors, fieldValue);
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions {}

export function createFormValidatorFactory<T>({
  // `isJSON` validator option is `false` by default
  valueToJSON = (value) => value as Json,
  ...vOptions
}: Omit<ValidatorOptions, keyof ValueToJSON> & Partial<ValueToJSON>) {
  return (
    options: Omit<
      FormValidatorOptions,
      keyof ValueToJSON | keyof ValidatorOptions
    >
  ) => {
    const full: FormValidatorOptions = {
      valueToJSON,
      ...vOptions,
      ...options,
    };
    return Object.assign(
      createValidator(full),
      createFormValueValidator<T>(full),
      createFieldValueValidator(full)
    );
  };
}
