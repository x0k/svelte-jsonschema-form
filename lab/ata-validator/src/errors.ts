import {
  encodePseudoElement,
  getRootUiSchemaTitleByPath,
  type Config,
  type FailureValidationResult,
  type FormValue,
  type Schema,
  type UiSchemaRoot,
} from "@sjsf/form";
import { pathFromLocation, type Path } from "@sjsf/form/core";
import type { ValidationError } from "ata-validator";

export interface ErrorsTransformerOptions {
  uiSchema?: UiSchemaRoot;
}

function createInstancePath(
  { params: { missingProperty, propertyName } }: ValidationError,
  path: Path,
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
  { params: { missingProperty }, message }: ValidationError,
  getPropertyTitle: (
    missingProperty: string,
    parentSchema?: Schema,
  ) => string | undefined,
): string {
  if (!message) {
    return "";
  }
  if (typeof missingProperty !== "string") {
    return message;
  }
  const propertyTitle = getPropertyTitle(missingProperty);
  if (propertyTitle === undefined) {
    return message;
  }
  return message.replace(missingProperty, propertyTitle);
}

export function createFormErrorsTransformer({
  uiSchema = {},
}: ErrorsTransformerOptions) {
  return (
    errors: ValidationError[],
    data: FormValue,
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
                path.concat(missingProperty),
              );
              if (uiSchemaTitle !== undefined) {
                return uiSchemaTitle;
              }
              const prop = parentSchema?.properties?.[missingProperty];
              if (typeof prop === "object") {
                return prop.title;
              }
              return undefined;
            },
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
  errors: ValidationError[],
) {
  return errors
    .filter(config.required ? isRootFieldError : isRootAndNonTypeError)
    .map((error) => errorObjectToMessage(error, () => config.title));
}
