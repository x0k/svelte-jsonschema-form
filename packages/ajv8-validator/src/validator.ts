import {
  Ajv,
  type AsyncValidateFunction,
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
  type ValidatorsCache,
} from "./schema-compilers.js";
import {
  createFormErrorsTransformer,
  createFieldErrorsTransformer,
  type ErrorsTransformerOptions,
  validateAndTransformErrors,
  validateAndTransformErrorsAsync,
} from "./errors.js";
import { CAST_FORM_DATA, NO_FILED_ERRORS } from "./internals.js";

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

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      return validateAndTransformErrors(
        options.compileSchema(rootSchema, rootSchema),
        formValue,
        CAST_FORM_DATA<T>,
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
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(config, fieldValue) {
      return validateAndTransformErrors(
        compileFieldSchema(config),
        fieldValue,
        NO_FILED_ERRORS,
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

export function createAsyncFormValueValidator<T>(
  options: AsyncFormValueValidatorOptions
): AsyncFormValueValidator<T> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      return validateAndTransformErrorsAsync(
        options.compileAsyncSchema(rootSchema, rootSchema),
        formValue,
        CAST_FORM_DATA<T>,
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
}: AsyncFieldValueValidatorOptions): AsyncFieldValueValidator {
  return {
    async validateFieldValueAsync(_, config, fieldValue) {
      return validateAndTransformErrorsAsync(
        compileAsyncFieldSchema(config),
        fieldValue,
        NO_FILED_ERRORS,
        createFieldErrorsTransformer(config)
      );
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator<T>({
  ajvOptions = DEFAULT_AJV_CONFIG,
  ajvPlugins = addFormComponents,
  ajv = ajvPlugins(new Ajv(ajvOptions)),
  validatorsCache,
  compileSchema = createSchemaCompiler(ajv, false, validatorsCache),
  compileFieldSchema = createFieldSchemaCompiler(ajv, false),
  ...rest
}: Partial<FormValidatorOptions> & {
  /**
   * @default `DEFAULT_AJV_CONFIG`
   */
  ajvOptions?: Options;
  /**
   * @default `addFormComponents`
   */
  ajvPlugins?: (ajv: Ajv) => Ajv;
  ajv?: Ajv;
  validatorsCache?: ValidatorsCache;
} = {}) {
  const options: FormValidatorOptions = {
    ...rest,
    compileSchema,
    compileFieldSchema,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator<T>(options),
    createFieldValueValidator(options)
  );
}

export interface AsyncFormValidatorOptions
  extends ValidatorOptions,
    AsyncFormValueValidatorOptions,
    AsyncFieldValueValidatorOptions {}

export function createAsyncFormValidator<T>({
  ajv,
  validatorsCache,
  compileSchema = createSchemaCompiler(ajv, false, validatorsCache),
  compileAsyncSchema = createSchemaCompiler(ajv, true, validatorsCache),
  compileAsyncFieldSchema = createFieldSchemaCompiler(ajv, true),
  ...rest
}: Partial<AsyncFormValidatorOptions> & {
  ajv: Ajv;
  validatorsCache?: ValidatorsCache;
}) {
  const options: AsyncFormValidatorOptions = {
    ...rest,
    compileSchema,
    compileAsyncSchema,
    compileAsyncFieldSchema,
  };
  return Object.assign(
    createValidator(options),
    createAsyncFormValueValidator<T>(options),
    createAsyncFieldValueValidator(options)
  );
}
