import type { ValidationError } from "@exodus/schemasafe";
import { getValueByPath } from "@sjsf/form/lib/object";
import {
  getSchemaDefinitionByPath,
  pathFromRef,
  type Path,
} from "@sjsf/form/core";
import {
  getRootSchemaTitleByPath,
  getRootUiSchemaTitleByPath,
  pathToId,
  type Config,
  type IdPrefixOption,
  type IdSeparatorOption,
  type Schema,
  type UiSchemaRoot,
} from "@sjsf/form";

export interface ErrorsTransformerOptions
  extends IdPrefixOption,
    IdSeparatorOption {
  uiSchema?: UiSchemaRoot;
}

function extractKeywordValue(
  keyword: string,
  rootSchema: Schema,
  instancePath: Path,
  schemaPath: Path
) {
  const schema = getValueByPath(rootSchema, schemaPath);
  if (schema && typeof schema === "object" && keyword in schema) {
    return String((schema as Record<string, unknown>)[keyword]);
  }
  const def = getSchemaDefinitionByPath(rootSchema, rootSchema, instancePath);
  if (typeof def === "object" && def[keyword as keyof Schema] !== undefined) {
    return String(def[keyword as keyof Schema]);
  }
}

function transformError({
  instanceLocation,
  keywordLocation,
}: ValidationError) {
  const instancePath = pathFromRef(instanceLocation);
  const keywordPath = pathFromRef(keywordLocation);
  const keyword = keywordPath[keywordPath.length - 1]?.toString() ?? "invalid";
  const schemaPath = keywordPath.slice(0, -1);
  return {
    instancePath,
    keywordPath,
    keyword,
    schemaPath,
  };
}

function createErrorMessage(keyword: string, details: string | undefined) {
  return details ? `${keyword} (${details})` : keyword;
}

export function createErrorsTransformer(options: ErrorsTransformerOptions) {
  const extractPropertyTitle = (
    rootSchema: Schema,
    instance: Path,
    schemaPath: Path,
    error: ValidationError
  ): string => {
    let title = getRootUiSchemaTitleByPath(options.uiSchema ?? {}, instance);
    if (title !== undefined) {
      return title;
    }
    const schema = getValueByPath(rootSchema, schemaPath);
    if (
      schema &&
      typeof schema === "object" &&
      "title" in schema &&
      typeof schema.title === "string"
    ) {
      return schema.title;
    }
    return (
      getRootSchemaTitleByPath(rootSchema, instance) ??
      instance[instance.length - 1]?.toString() ??
      error.instanceLocation
    );
  };
  return (rootSchema: Schema, errors: ValidationError[] | undefined) => {
    // NOTE: According to the compiled output of `schemasafe`
    // errors can be `null`
    if (!errors) {
      return [];
    }
    return errors.map((error) => {
      const { instancePath, schemaPath, keyword } = transformError(error);
      return {
        instanceId: pathToId(instancePath, options),
        propertyTitle: extractPropertyTitle(
          rootSchema,
          instancePath,
          schemaPath,
          error
        ),
        message: createErrorMessage(
          keyword,
          extractKeywordValue(keyword, rootSchema, instancePath, schemaPath)
        ),
        error,
      };
    });
  };
}

function isRootError(error: ValidationError): boolean {
  return error.instanceLocation === "#";
}

function isRootNonTypeError(error: ValidationError): boolean {
  return isRootError(error) && !error.keywordLocation.endsWith("type");
}

export function transformFieldErrors(
  field: Config,
  errors: ValidationError[] | undefined
) {
  // NOTE: According to the compiled output of `schemasafe`
  // errors can be `null`
  if (!errors) {
    return [];
  }
  return (
    errors
      .filter(field.required ? isRootError : isRootNonTypeError)
      .map((error) => {
        const { keyword } = transformError(error);
        return {
          instanceId: field.id,
          propertyTitle: field.title,
          message: createErrorMessage(
            keyword,
            field.schema?.[keyword as keyof Schema]?.toString()
          ),
          error,
        };
      }) ?? []
  );
}
