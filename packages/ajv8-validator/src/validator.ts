import {
  Ajv,
  type AsyncValidateFunction,
  type ErrorObject,
  type Options,
  type ValidateFunction,
} from "ajv";
import { getValueByPath } from "@sjsf/form/lib/object";
import type { Validator } from "@sjsf/form/core";
import {
  computePseudoId,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  makeChildId,
  pathToId,
  type AsyncFieldValueValidator,
  type AsyncFormValueValidator,
  type Config,
  type Schema,
  type FieldValueValidator,
  type FormValueValidator,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationError,
  type IdPrefixOption,
  type IdSeparatorOption,
  type IdPseudoSeparatorOption,
} from "@sjsf/form";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "./model.js";
import {
  createFieldSchemaCompiler,
  createSchemaCompiler,
} from "./schema-compilers.js";

const NO_ERRORS: ValidationError<ErrorObject>[] = [];

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

interface ErrorsTransformerOptions
  extends IdPrefixOption,
    IdSeparatorOption,
    IdPseudoSeparatorOption {
  uiSchema?: UiSchemaRoot;
}

function errorObjectToMessage(
  { params: { missingProperty }, parentSchema, message }: ErrorObject,
  getPropertyTitle: (
    missingProperty: string,
    parentSchema?: Schema
  ) => string | undefined
): string {
  if (!message) {
    return "";
  }
  if (missingProperty === undefined) {
    return message;
  }
  const propertyTitle = getPropertyTitle(missingProperty, parentSchema);
  if (propertyTitle === undefined) {
    return message;
  }
  return message.replace(missingProperty, propertyTitle);
}

function createFormErrorsTransformer(options: ErrorsTransformerOptions) {
  const instancePathToId = (
    {
      params: { missingProperty, propertyName: propertyNameParam },
      propertyName = propertyNameParam,
    }: ErrorObject,
    path: string[]
  ) => {
    let id = pathToId(path, options);
    id =
      missingProperty !== undefined
        ? makeChildId(id, missingProperty, options)
        : id;
    id =
      propertyName !== undefined
        ? computePseudoId(
            makeChildId(id, propertyName, options),
            "key-input",
            options
          )
        : id;
    return id;
  };
  const errorObjectToPropertyTitle = (
    { parentSchema }: ErrorObject,
    path: string[]
  ): string => {
    const instanceUiSchema = getValueByPath<UiSchema | undefined, 0>(
      options.uiSchema,
      path
    );
    return (
      instanceUiSchema?.["ui:options"]?.title ??
      parentSchema?.title ??
      path.join(".")
    );
  };
  return (errors: ErrorObject[]) => {
    return errors.map((error) => {
      let path = error.instancePath.split("/");
      if (path[0] === "") {
        path = path.slice(1);
      }
      return {
        instanceId: instancePathToId(error, path),
        propertyTitle: errorObjectToPropertyTitle(error, path),
        message: errorObjectToMessage(
          error,
          (missingProperty, parentSchema) => {
            // TODO: Write a specific `getValueByPath` function for
            // `items`, `additionalItems` and other cases
            const uiSchemaTitle = getValueByPath<UiSchema | undefined, 0>(
              options.uiSchema,
              path.concat(missingProperty)
            )?.["ui:options"]?.title;
            if (uiSchemaTitle !== undefined) {
              return uiSchemaTitle;
            }
            const prop = parentSchema?.properties?.[missingProperty];
            if (typeof prop === "object") {
              return prop.title;
            }
            return undefined;
          }
        ),
        error,
      };
    });
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions,
    ErrorsTransformerOptions {}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator<ErrorObject> {
  const transformFormErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.compileSchema(rootSchema, rootSchema);
      validator(formValue);
      const errors = validator.errors;
      validator.errors = null;
      if (!errors) {
        return NO_ERRORS;
      }
      return transformFormErrors(errors);
    },
  };
}

export interface FieldValueValidatorOptions {
  compileFieldSchema: (config: Config) => ValidateFunction;
}

function isFieldError(error: ErrorObject): boolean {
  return error.instancePath === "/field";
}

function transformFieldErrors(errors: ErrorObject[], config: Config) {
  return errors.filter(isFieldError).map((error) => ({
    instanceId: config.id,
    propertyTitle: config.title,
    message: errorObjectToMessage(error, () => config.title),
    error,
  }));
}

export function createFieldValueValidator({
  compileFieldSchema,
}: FieldValueValidatorOptions): FieldValueValidator<ErrorObject> {
  return {
    validateFieldValue(config, fieldValue) {
      const validator = compileFieldSchema(config);
      const data = { field: fieldValue };
      validator(data);
      const errors = validator.errors;
      validator.errors = null;
      if (!errors) {
        return NO_ERRORS;
      }
      return transformFieldErrors(errors, config);
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
  const transformFormErrors = createFormErrorsTransformer(options);
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      const validator = options.compileAsyncSchema(rootSchema, rootSchema);
      try {
        await validator(formValue);
      } catch (e) {
        if (!(e instanceof Ajv.ValidationError)) {
          throw e;
        }
        return transformFormErrors(e.errors as ErrorObject[]);
      } finally {
        validator.errors = null;
      }
      return NO_ERRORS;
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
      const validator = compileAsyncFieldSchema(config);
      const data = { field: fieldValue };
      try {
        await validator(data);
      } catch (e) {
        if (!(e instanceof Ajv.ValidationError)) {
          throw e;
        }
        return transformFieldErrors(e.errors as ErrorObject[], config);
      } finally {
        validator.errors = null;
      }
      return NO_ERRORS;
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
  idPrefix = DEFAULT_ID_PREFIX,
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR,
  uiSchema = {},
}: Partial<AsyncFormValidatorOptions> & { ajv: Ajv }) {
  const options: AsyncFormValidatorOptions = {
    compileSchema,
    compileAsyncSchema,
    compileAsyncFieldSchema,
    idPrefix,
    idSeparator,
    idPseudoSeparator,
    uiSchema,
  };
  return Object.assign(
    createValidator(options),
    createAsyncFormValueValidator(options),
    createAsyncFieldValueValidator(options)
  );
}
