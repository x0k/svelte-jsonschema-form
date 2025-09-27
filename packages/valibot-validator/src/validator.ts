import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import * as v from "valibot";

import {
  createAugmentedId,
  type SchemaRegistry,
  type ValibotIssue,
} from "./model.js";
import { transformFormErrors, transformFieldErrors } from "./errors.js";

function getValibotSchema(
  registry: SchemaRegistry,
  { $id: id, allOf }: Schema
) {
  if (id === undefined) {
    const firstAllOfItem = allOf?.[0];
    if (
      typeof firstAllOfItem === "object" &&
      firstAllOfItem.$id !== undefined
    ) {
      id = createAugmentedId(firstAllOfItem.$id);
    } else {
      throw new Error("Schema id not found");
    }
  }
  const valibotSchema = registry.get(id);
  if (valibotSchema === undefined) {
    throw new Error(`Valibot schema with id "${id}" not found`);
  }
  return valibotSchema;
}

export interface SchemaRegistryProvider {
  schemaRegistry: SchemaRegistry;
}

export interface ValidatorOptions extends SchemaRegistryProvider {}

export function createValidator({
  schemaRegistry,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, _, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const valibotSchema = getValibotSchema(schemaRegistry, schema);
      return v.safeParse(valibotSchema, formValue).success;
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator {
  return {
    validateFormValue(rootSchema, formValue) {
      const valibotSchema = getValibotSchema(
        options.schemaRegistry,
        rootSchema
      );
      return transformFormErrors(v.safeParse(valibotSchema, formValue));
    },
  };
}

export interface AsyncFormValueValidatorOptions
  extends SchemaRegistryProvider {}

export function createAsyncFormValueValidator(
  options: AsyncFormValueValidatorOptions
): AsyncFormValueValidator {
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      const valibotSchema = getValibotSchema(
        options.schemaRegistry,
        rootSchema
      );
      const result = await v.safeParseAsync(valibotSchema, formValue);
      return transformFormErrors(result);
    },
  };
}

export interface FieldValueValidatorOptions extends SchemaRegistryProvider {}

export function createFieldValueValidator({
  schemaRegistry,
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const valibotSchema = getValibotSchema(schemaRegistry, field.schema);
      const result = v.safeParse(valibotSchema, fieldValue);
      return transformFieldErrors(result);
    },
  };
}

export interface AsyncFieldValueValidatorOptions
  extends SchemaRegistryProvider {}

export function createAsyncFieldValueValidator({
  schemaRegistry,
}: AsyncFieldValueValidatorOptions): AsyncFieldValueValidator {
  return {
    async validateFieldValueAsync(_, field, fieldValue) {
      const valibotSchema = getValibotSchema(schemaRegistry, field.schema);
      const result = await v.safeParseAsync(valibotSchema, fieldValue);
      return transformFieldErrors(result);
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator(options: FormValidatorOptions) {
  return Object.assign(
    createValidator(options),
    createFormValueValidator(options),
    createFieldValueValidator(options)
  );
}

export interface AsyncFormValidatorOptions
  extends ValidatorOptions,
    AsyncFormValueValidatorOptions,
    AsyncFieldValueValidatorOptions {}

export function createAsyncFormValidator(options: AsyncFormValidatorOptions) {
  return Object.assign(
    createValidator(options),
    createAsyncFormValueValidator(options),
    createAsyncFieldValueValidator(options)
  );
}
