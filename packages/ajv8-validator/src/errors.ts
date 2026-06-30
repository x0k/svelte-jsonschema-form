import {
  encodePseudoElement,
  getRootUiSchemaTitleByPath,
  type Config,
  type FailureValidationResult,
  type FormValue,
  type Schema,
  type UiSchemaRoot,
} from "@sjsf/form";
import { PROPERTIES_KEY, pathFromLocation, type Path } from "@sjsf/form/core";
import { getValueByPath } from "@sjsf/form/lib/object";
import {
  Ajv,
  type AsyncValidateFunction,
  type ErrorObject,
  type ValidateFunction,
} from "ajv";

import type { CompiledValidateFunction } from "./internals.js";

export interface ErrorsTransformerOptions {
  uiSchema?: UiSchemaRoot;
  schema?: Schema;
}

function createInstancePath(
  {
    params: { missingProperty, propertyName: propertyNameParam },
    propertyName = propertyNameParam,
  }: ErrorObject,
  path: Path
) {
  let id = path;
  id = missingProperty !== undefined ? path.concat(missingProperty) : id;
  id =
    propertyName !== undefined
      ? path.concat(propertyName, encodePseudoElement("key-input"))
      : id;
  return id;
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

export function createFormErrorsTransformer({
  uiSchema = {},
  schema = {},
}: ErrorsTransformerOptions) {
  return (errors: ErrorObject[], data: FormValue): FailureValidationResult => {
    return {
      value: data,
      errors: errors.map((error) => {
        const path = pathFromLocation(error.instancePath, data);
        return {
          path: createInstancePath(error, path),
          message: errorObjectToMessage(
            error,
            (missingProperty, parentSchema) => {
              const uiSchemaTitle = getRootUiSchemaTitleByPath(
                uiSchema,
                path.concat(missingProperty)
              );
              if (uiSchemaTitle !== undefined) {
                return uiSchemaTitle;
              }
              const prop = parentSchema?.properties?.[missingProperty];
              if (typeof prop === "object") {
                return prop.title;
              }
              const schemaPath: Path = [];
              for (const part of path) {
                schemaPath.push(PROPERTIES_KEY, part);
              }
              schemaPath.push(PROPERTIES_KEY, missingProperty, "title");
              return getValueByPath(schema, schemaPath);
            }
          ),
        };
      }),
    };
  };
}

function isRootFieldError(error: ErrorObject): boolean {
  return error.instancePath === "";
}

function isRootAndNonTypeError(error: ErrorObject): boolean {
  return isRootFieldError(error) && error.keyword !== "type";
}

export function createFieldErrorsTransformer(config: Config) {
  return (errors: ErrorObject[]) =>
    errors
      .filter(config.required ? isRootFieldError : isRootAndNonTypeError)
      .map((error) => errorObjectToMessage(error, () => config.title));
}

export type TransformInput<T> = (data: FormValue) => T;
export type TransformErrors<R> = (errors: ErrorObject[], data: FormValue) => R;

export function validateAndTransformErrors<T, R>(
  validate: ValidateFunction | CompiledValidateFunction,
  data: FormValue,
  transformData: TransformInput<T>,
  transformErrors: TransformErrors<R>
): T | R {
  validate(data);
  const errors = validate.errors;
  validate.errors = null;
  if (!errors) {
    return transformData(data);
  }
  return transformErrors(errors, data);
}

export async function validateAndTransformErrorsAsync<T, R>(
  validate: AsyncValidateFunction,
  data: FormValue,
  transformInput: TransformInput<T>,
  transformErrors: TransformErrors<R>
): Promise<T | R> {
  try {
    await validate(data);
  } catch (e) {
    if (!(e instanceof Ajv.ValidationError)) {
      throw e;
    }
    return transformErrors(e.errors as ErrorObject[], data);
  } finally {
    validate.errors = null;
  }
  return transformInput(data);
}

export type Localize = TransformErrors<ErrorObject[]>;

export interface LocalizeOptions {
  localize?: Localize;
}

export function withLocalize<R>(
  transform: TransformErrors<R>,
  localize?: Localize
): TransformErrors<R> {
  return localize
    ? (errors, data) => transform(localize(errors, data), data)
    : transform;
}
