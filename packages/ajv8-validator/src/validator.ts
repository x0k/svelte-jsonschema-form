import {
  Ajv,
  type AsyncValidateFunction,
  type ErrorObject,
  type Options,
  type ValidateFunction,
} from "ajv";
import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  Config,
  Schema,
  FieldValueValidator,
  FormValueValidator,
  Validator,
} from "@sjsf/form";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "./model.js";
import {
  createFieldSchemaCompiler,
  createSchemaCompiler,
} from "./schema-compilers.js";
import {
  createFormErrorsTransformer,
  createFieldErrorsTransformer,
  type ErrorsTransformerOptions,
  validateAndTransformErrors,
  validateAndTransformErrorsAsync,
} from "./errors.js";

export interface ValidatorOptions {
  compileSchema: (schema: Schema, rootSchema: Schema) => ValidateFunction;
}

export function createValidator({
  compileSchema,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, rootSchema, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validator = compileSchema(schemaDef, rootSchema);
      try {
        return validator(formValue);
      } catch (e) {
        console.warn("Failed to validate", e);
        return false;
      }
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions,
    ErrorsTransformerOptions {}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator<ErrorObject> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      return validateAndTransformErrors(
        options.compileSchema(rootSchema, rootSchema),
        formValue,
        transformErrors
      );
    },
  };
}

export interface FieldValueValidatorOptions {
  compileFieldSchema: (config: Config) => ValidateFunction;
}

export function createFieldValueValidator({
  compileFieldSchema,
}: FieldValueValidatorOptions): FieldValueValidator<ErrorObject> {
  return {
    validateFieldValue(config, fieldValue) {
      return validateAndTransformErrors(
        compileFieldSchema(config),
        fieldValue,
        createFieldErrorsTransformer(config)
      );
    },
  };
}

export interface AsyncFormValueValidatorOptions
  extends ErrorsTransformerOptions {
  compileAsyncSchema: (
    schema: Schema,
    rootSchema: Schema
  ) => AsyncValidateFunction;
}

export function createAsyncFormValueValidator(
  options: AsyncFormValueValidatorOptions
): AsyncFormValueValidator<ErrorObject> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      return validateAndTransformErrorsAsync(
        options.compileAsyncSchema(rootSchema, rootSchema),
        formValue,
        transformErrors
      );
    },
  };
}

export interface AsyncFieldValueValidatorOptions {
  compileAsyncFieldSchema: (config: Config) => AsyncValidateFunction;
}

export function createAsyncFieldValueValidator({
  compileAsyncFieldSchema,
}: AsyncFieldValueValidatorOptions): AsyncFieldValueValidator<ErrorObject> {
  return {
    async validateFieldValueAsync(_, config, fieldValue) {
      return validateAndTransformErrorsAsync(
        compileAsyncFieldSchema(config),
        fieldValue,
        createFieldErrorsTransformer(config)
      );
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator({
  ajvOptions = DEFAULT_AJV_CONFIG,
  ajv = addFormComponents(new Ajv(ajvOptions)),
  compileSchema = createSchemaCompiler(ajv, false),
  compileFieldSchema = createFieldSchemaCompiler(ajv, false),
  ...rest
}: Partial<FormValidatorOptions> & {
  ajv?: Ajv;
  ajvOptions?: Options;
} = {}) {
  const options: FormValidatorOptions = {
    ...rest,
    compileSchema,
    compileFieldSchema,
  };
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

export function createAsyncFormValidator({
  ajv,
  compileSchema = createSchemaCompiler(ajv, false),
  compileAsyncSchema = createSchemaCompiler(ajv, true),
  compileAsyncFieldSchema = createFieldSchemaCompiler(ajv, true),
  ...rest
}: Partial<AsyncFormValidatorOptions> & { ajv: Ajv }) {
  const options: AsyncFormValidatorOptions = {
    ...rest,
    compileSchema,
    compileAsyncSchema,
    compileAsyncFieldSchema,
  };
  return Object.assign(
    createValidator(options),
    createAsyncFormValueValidator(options),
    createAsyncFieldValueValidator(options)
  );
}
