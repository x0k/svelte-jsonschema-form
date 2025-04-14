import {
  createChildId,
  createPseudoId,
  getUiSchemaByPath,
  pathToId,
  type Config,
  type IdOptions,
  type Schema,
  type UiSchemaRoot,
} from "@sjsf/form";
import type { ErrorObject } from "ajv";

export interface ErrorsTransformerOptions extends IdOptions {
  uiSchema?: UiSchemaRoot;
}

export function errorObjectToMessage(
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

export function createFormErrorsTransformer(options: ErrorsTransformerOptions) {
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
        ? createChildId(id, missingProperty, options)
        : id;
    id =
      propertyName !== undefined
        ? createPseudoId(
            createChildId(id, propertyName, options),
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
    const instanceUiSchema = getUiSchemaByPath(options.uiSchema, path);
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
            const uiSchemaTitle = getUiSchemaByPath(
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

export function isFieldError(error: ErrorObject): boolean {
  return error.instancePath === "/field";
}

export function isRootFieldError(error: ErrorObject): boolean {
  return error.instancePath === "/"
}

export function transformFieldErrors(
  errors: ErrorObject[],
  config: Config,
  errorFilter = isFieldError
) {
  return errors.filter(errorFilter).map((error) => ({
    instanceId: config.id,
    propertyTitle: config.title,
    message: errorObjectToMessage(error, () => config.title),
    error,
  }));
}
