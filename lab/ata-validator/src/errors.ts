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
import type { ValidationError } from "ata-validator";

export interface ErrorsTransformerOptions {
  uiSchema?: UiSchemaRoot;
  schema?: Schema;
}

function createInstancePath(
  { params: { missingProperty, propertyName } }: ValidationError,
  path: Path
) {
  let id = path;
  id = typeof missingProperty === "string" ? path.concat(missingProperty) : id;
  id =
    typeof propertyName === "string"
      ? path.concat(propertyName, encodePseudoElement("key-input"))
      : id;
  return id;
}

function errorObjectToMessage(
  { params: { missingProperty }, message, parentSchema }: ValidationError,
  getPropertyTitle: (
    missingProperty: string,
    parentSchema?: Schema
  ) => string | undefined
): string {
  if (!message) {
    return "";
  }
  if (typeof missingProperty !== "string") {
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
  return (
    errors: ValidationError[],
    data: FormValue
  ): FailureValidationResult => {
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

function isRootFieldError(error: ValidationError): boolean {
  return error.instancePath === "";
}

function isRootAndNonTypeError(error: ValidationError): boolean {
  return isRootFieldError(error) && error.keyword !== "type";
}

export function transformFieldErrors(
  config: Config,
  errors: ValidationError[]
) {
  return errors
    .filter(config.required ? isRootFieldError : isRootAndNonTypeError)
    .map((error) => errorObjectToMessage(error, () => config.title));
}
