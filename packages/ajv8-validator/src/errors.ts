import {
  getRootUiSchemaTitleByPath,
  type Config,
  type FormIdBuilder,
  type Schema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import { pathFromLocation, type Path } from "@sjsf/form/core";
import {
  Ajv,
  type AsyncValidateFunction,
  type ErrorObject,
  type ValidateFunction,
} from "ajv";

export interface ErrorsTransformerOptions {
  idBuilder: FormIdBuilder;
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

export function createFormErrorsTransformer({
  idBuilder,
  uiSchema,
}: ErrorsTransformerOptions) {
  const instancePathToId = (
    {
      params: { missingProperty, propertyName: propertyNameParam },
      propertyName = propertyNameParam,
    }: ErrorObject,
    path: Path
  ) => {
    let id = idBuilder.fromPath(path);
    id =
      missingProperty !== undefined
        ? idBuilder.propertyId(id, missingProperty)
        : id;
    id =
      propertyName !== undefined
        ? idBuilder.pseudoId(
            idBuilder.propertyId(id, propertyName),
            "key-input"
          )
        : id;
    return id;
  };
  return (errors: ErrorObject[], data: unknown) => {
    return errors.map((error) => {
      const path = pathFromLocation(error.instancePath, data);
      return {
        instanceId: instancePathToId(error, path),
        propertyTitle:
          getRootUiSchemaTitleByPath(uiSchema, path) ??
          error.parentSchema?.title ??
          path[path.length - 1],
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
            return undefined;
          }
        ),
        error,
      };
    });
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
      .map((error) => ({
        instanceId: config.id,
        propertyTitle: config.title,
        message: errorObjectToMessage(error, () => config.title),
        error,
      }));
}

export type TransformErrors = (
  errors: ErrorObject[],
  data: unknown
) => ValidationError<ErrorObject>[];

export function validateAndTransformErrors(
  validate: ValidateFunction,
  data: unknown,
  transformErrors: TransformErrors
) {
  validate(data);
  const errors = validate.errors;
  validate.errors = null;
  if (!errors) {
    return [];
  }
  return transformErrors(errors, data);
}

export async function validateAndTransformErrorsAsync(
  validate: AsyncValidateFunction,
  data: unknown,
  transformErrors: TransformErrors
) {
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
  return [];
}
