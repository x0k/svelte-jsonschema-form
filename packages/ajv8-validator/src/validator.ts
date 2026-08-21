import type {
  AsyncFieldValueValidator,
  AsyncFormValueValidator,
  Config,
  Schema,
  FieldValueValidator,
  FormValueValidator,
  Validator,
} from "@sjsf/form";
import {
  Ajv,
  type AsyncValidateFunction,
  type Options,
  type ValidateFunction,
} from "ajv";

import {
  createFormErrorsTransformer,
  createFieldErrorsTransformer,
  validateAndTransformErrors,
  validateAndTransformErrorsAsync,
  type LocalizeOptions,
  withLocalize,
} from "./errors.js";
import { CAST_FORM_DATA, NO_FILED_ERRORS } from "./internals.js";
import {
  addFormComponents,
  DEFAULT_AJV_CONFIG,
  type Schemas,
} from "./model.js";
import {
  createFieldSchemaCompiler,
  createSchemaCompiler,
  type ValidatorsCache,
} from "./schema-compilers.js";

export interface ValidatorOptions {
  compileSchema: (schema: Schema) => ValidateFunction;
}

export function createValidator({
  compileSchema,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validator = compileSchema(schemaDef);
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
  extends ValidatorOptions, Schemas, LocalizeOptions {}

export function createFormValueValidator<T>({
  compileSchema,
  schema,
  localize,
  uiSchema = {},
}: FormValueValidatorOptions): FormValueValidator<T> {
  const validate = compileSchema(schema);
  const transformErrors = withLocalize(
    createFormErrorsTransformer(schema, uiSchema),
    localize
  );
  return {
    validateFormValue(formValue) {
      return validateAndTransformErrors(
        validate,
        formValue,
        CAST_FORM_DATA<T>,
        transformErrors
      );
    },
  };
}

export interface FieldValueValidatorOptions extends LocalizeOptions {
  compileFieldSchema: (config: Config) => ValidateFunction;
}

export function createFieldValueValidator({
  compileFieldSchema,
  localize,
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(config, fieldValue) {
      return validateAndTransformErrors(
        compileFieldSchema(config),
        fieldValue,
        NO_FILED_ERRORS,
        withLocalize(createFieldErrorsTransformer(config), localize)
      );
    },
  };
}

export interface AsyncFormValueValidatorOptions
  extends Schemas, LocalizeOptions {
  compileAsyncSchema: (schema: Schema) => AsyncValidateFunction;
}

export function createAsyncFormValueValidator<T>({
  compileAsyncSchema,
  schema,
  localize,
  uiSchema = {},
}: AsyncFormValueValidatorOptions): AsyncFormValueValidator<T> {
  const validateAsync = compileAsyncSchema(schema);
  const transformErrors = withLocalize(
    createFormErrorsTransformer(schema, uiSchema),
    localize
  );
  return {
    async validateFormValueAsync(_, formValue) {
      return validateAndTransformErrorsAsync(
        validateAsync,
        formValue,
        CAST_FORM_DATA<T>,
        transformErrors
      );
    },
  };
}

export interface AsyncFieldValueValidatorOptions extends LocalizeOptions {
  compileAsyncFieldSchema: (config: Config) => AsyncValidateFunction;
}

export function createAsyncFieldValueValidator({
  compileAsyncFieldSchema,
  localize,
}: AsyncFieldValueValidatorOptions): AsyncFieldValueValidator {
  return {
    async validateFieldValueAsync(_, config, fieldValue) {
      return validateAndTransformErrorsAsync(
        compileAsyncFieldSchema(config),
        fieldValue,
        NO_FILED_ERRORS,
        withLocalize(createFieldErrorsTransformer(config), localize)
      );
    },
  };
}

export interface FormValidatorOptions
  extends
    ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

interface AjvConstructor {
  new (options: Options): Ajv;
}

export function createFormValidator<T>({
  schema,
  ajvOptions = DEFAULT_AJV_CONFIG,
  ajvPlugins = addFormComponents,
  Ajv: AjvConstructor = Ajv,
  ajv = ajvPlugins(new AjvConstructor(ajvOptions)),
  validatorsCache,
  compileSchema = createSchemaCompiler(ajv, false, schema, validatorsCache),
  compileFieldSchema = createFieldSchemaCompiler(ajv, false),
  ...rest
}: Partial<FormValidatorOptions> & {
  schema: Schema;
  /**
   * @default `DEFAULT_AJV_CONFIG`
   */
  ajvOptions?: Options;
  /**
   * @default `addFormComponents`
   */
  ajvPlugins?: (ajv: Ajv) => Ajv;
  Ajv?: AjvConstructor;
  ajv?: Ajv;
  validatorsCache?: ValidatorsCache;
}) {
  const options: FormValidatorOptions = {
    ...rest,
    schema,
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
  extends
    ValidatorOptions,
    AsyncFormValueValidatorOptions,
    AsyncFieldValueValidatorOptions {}

export function createAsyncFormValidator<T>({
  ajv,
  schema,
  validatorsCache,
  compileSchema = createSchemaCompiler(ajv, false, schema, validatorsCache),
  compileAsyncSchema = createSchemaCompiler(ajv, true, schema, validatorsCache),
  compileAsyncFieldSchema = createFieldSchemaCompiler(ajv, true),
  ...rest
}: Partial<AsyncFormValidatorOptions> & {
  ajv: Ajv;
  schema: Schema;
  validatorsCache?: ValidatorsCache;
}) {
  const options: AsyncFormValidatorOptions = {
    ...rest,
    schema,
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
