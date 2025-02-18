import { type Ajv, type ErrorObject, type ValidateFunction } from "ajv";
import type { SchemaDefinition, Validator } from "@sjsf/form/core";
import {
  computePseudoId,
  makeChildId,
  pathToId,
  type Config,
  type Schema,
  type SyncFieldValueValidator,
  type SyncFormValueValidator,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationErrors,
} from "@sjsf/form";
import { getValueByPath } from "@sjsf/form/lib/object";

const trueSchema: Schema = {};
const falseSchema: Schema = {
  not: {},
};
const NO_ERRORS: ValidationErrors<ErrorObject> = [];

export interface ValidatorOptions {
  compileSchema: (schema: Schema, rootSchema: Schema) => ValidateFunction;
}

function transformSchemaDefinition(schema: SchemaDefinition): Schema {
  switch (schema) {
    case true:
      return trueSchema;
    case false:
      return falseSchema;
    default:
      return schema;
  }
}

export function createValidator({
  compileSchema,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, rootSchema, formValue) {
      const validator = compileSchema(
        transformSchemaDefinition(schemaDef),
        rootSchema
      );
      try {
        return validator(formValue);
      } catch (e) {
        console.warn("Failed to validate", e);
        return false;
      }
    },
  };
}

interface ErrorsTransformerOptions {
  idPrefix: string;
  idSeparator: string;
  idPseudoSeparator: string;
  uiSchema: UiSchemaRoot;
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

function createFormErrorsTransformer({
  uiSchema,
  idPrefix,
  idSeparator,
  idPseudoSeparator,
}: ErrorsTransformerOptions) {
  const instancePathToId = (
    {
      params: { missingProperty, propertyName: propertyNameParam },
      propertyName = propertyNameParam,
    }: ErrorObject,
    path: string[]
  ) => {
    let id = pathToId(idPrefix, idSeparator, path);
    id =
      missingProperty !== undefined
        ? makeChildId(idSeparator, id, missingProperty)
        : id;
    id =
      propertyName !== undefined
        ? computePseudoId(
            idPseudoSeparator,
            makeChildId(idSeparator, id, propertyName),
            "key-input"
          )
        : id;
    return id;
  };
  const errorObjectToPropertyTitle = (
    { parentSchema }: ErrorObject,
    path: string[]
  ): string => {
    const instanceUiSchema = getValueByPath<UiSchema, 0>(uiSchema, path);
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
            const uiSchemaTitle = getValueByPath<UiSchema, 0>(
              uiSchema,
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

export interface SyncFormValueValidatorOptions
  extends ValidatorOptions,
    ErrorsTransformerOptions {}

export function createSyncFormValueValidator(
  options: SyncFormValueValidatorOptions
): SyncFormValueValidator<ErrorObject> {
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

export interface SyncFieldValueValidatorOptions {
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

export function createSyncFieldValueValidator({
  compileFieldSchema,
}: SyncFieldValueValidatorOptions): SyncFieldValueValidator<ErrorObject> {
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
