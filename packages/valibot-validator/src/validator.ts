import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import * as v from "valibot";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import {
  createAugmentedId,
  type SchemaProvider,
  type SchemaRegistry,
} from "./model.js";

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
    isValid(schema, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const valibotSchema = getValibotSchema(schemaRegistry, schema);
      return v.safeParse(valibotSchema, formValue).success;
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions, SchemaProvider {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  const valibotSchema = getValibotSchema(
    options.schemaRegistry,
    options.schema
  );
  return {
    validateFormValue(formValue) {
      return transformFormErrors(
        v.safeParse(valibotSchema, formValue),
        formValue
      );
    },
  };
}

export interface AsyncFormValueValidatorOptions
  extends SchemaRegistryProvider, SchemaProvider {}

export function createAsyncFormValueValidator<T>(
  options: AsyncFormValueValidatorOptions
): AsyncFormValueValidator<T> {
  const valibotSchema = getValibotSchema(
    options.schemaRegistry,
    options.schema
  );
  return {
    async validateFormValueAsync(_, formValue) {
      const result = await v.safeParseAsync(valibotSchema, formValue);
      return transformFormErrors(result, formValue);
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

export interface AsyncFieldValueValidatorOptions extends SchemaRegistryProvider {}

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
  extends
    ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator<T>(options: FormValidatorOptions) {
  return Object.assign(
    createValidator(options),
    createFormValueValidator<T>(options),
    createFieldValueValidator(options)
  );
}

export interface AsyncFormValidatorOptions
  extends
    ValidatorOptions,
    AsyncFormValueValidatorOptions,
    AsyncFieldValueValidatorOptions {}

export function createAsyncFormValidator<T>(
  options: AsyncFormValidatorOptions
) {
  return Object.assign(
    createValidator(options),
    createAsyncFormValueValidator<T>(options),
    createAsyncFieldValueValidator(options)
  );
}
