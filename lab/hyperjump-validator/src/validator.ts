import {
  DETAILED,
  interpret,
  type AST,
} from "@hyperjump/json-schema/experimental";
import { fromJs } from "@hyperjump/json-schema/instance/experimental";
import type {
  FieldValueValidator,
  FormValue,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { DEFAULT_AUGMENT_SUFFIX } from "@sjsf/form/validators/precompile";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
export interface ValidatorOptions {
  ast: AST;
  augmentSuffix?: string;
}

type HyperjumpJson = Parameters<typeof fromJs>[0];

function validate(
  { ast, augmentSuffix = DEFAULT_AUGMENT_SUFFIX }: ValidatorOptions,
  { $id: id, allOf }: Schema,
  value: FormValue,
) {
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
  return interpret(
    {
      ast,
      schemaUri: `${id}#`,
    },
    fromJs(value as HyperjumpJson),
    DETAILED,
  );
}

export function createValidator(options: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      return validate(options, schema, formValue).valid;
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {
  // merger: () => Merger;
}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions,
): FormValueValidator<T> {
  return {
    validateFormValue(rootSchema, formValue) {
      const out = validate(options, rootSchema, formValue);
      return transformFormErrors(formValue, out);
    },
  };
}

export function createFieldValueValidator(
  options: ValidatorOptions,
): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const out = validate(options, field.schema, fieldValue);
      return transformFieldErrors(out);
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions, FormValueValidatorOptions {}

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
