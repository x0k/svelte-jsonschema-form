import {
  createPseudoPath,
  getRootUiSchemaTitleByPath,
  type Config,
  type Schema,
  type UiSchemaRoot,
} from "@sjsf/form";
import { pathFromLocation, type Path } from "@sjsf/form/core";
import {
  Ajv,
  type AsyncValidateFunction,
  type ErrorObject,
  type ValidateFunction,
} from "ajv";

export interface ErrorsTransformerOptions {
  uiSchema?: UiSchemaRoot;
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
      ? createPseudoPath(path.concat(propertyName), "key-input")
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
}: ErrorsTransformerOptions) {
  return (errors: ErrorObject[], data: unknown) => {
    return errors.map((error) => {
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
            return undefined;
          }
        ),
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
      .map((error) => errorObjectToMessage(error, () => config.title));
}

export type TransformErrors<R> = (errors: ErrorObject[], data: unknown) => R[];

export function validateAndTransformErrors<R>(
  validate: ValidateFunction,
  data: unknown,
  transformErrors: TransformErrors<R>
) {
  validate(data);
  const errors = validate.errors;
  validate.errors = null;
  if (!errors) {
    return [];
  }
  return transformErrors(errors, data);
}

export async function validateAndTransformErrorsAsync<R>(
  validate: AsyncValidateFunction,
  data: unknown,
  transformErrors: TransformErrors<R>
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
