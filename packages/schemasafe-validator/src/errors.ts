import type { ValidationError } from "@exodus/schemasafe";
import { getValueByPath } from "@sjsf/form/lib/object";
import {
  getSchemaDefinitionByPath,
  refToPath,
  type Path,
} from "@sjsf/form/core";
import {
  getRootSchemaTitleByPath,
  getUiSchemaByPath,
  pathToId,
  type IdPrefixOption,
  type IdSeparatorOption,
  type Schema,
  type UiSchema,
} from "@sjsf/form";

export interface ErrorsTransformerOptions
  extends IdPrefixOption,
    IdSeparatorOption {
  uiSchema?: UiSchema;
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

export function transformError({
  instanceLocation,
  keywordLocation,
}: ValidationError) {
  const instancePath = refToPath(instanceLocation);
  const keywordPath = refToPath(keywordLocation);
  const keyword = keywordPath[keywordPath.length - 1]?.toString() ?? "invalid";
  const schemaPath = keywordPath.slice(0, -1);
  return {
    instancePath,
    keywordPath,
    keyword,
    schemaPath,
  };
}

export function createErrorMessage(
  keyword: string,
  details: string | undefined
) {
  return details ? `${keyword} (${details})` : keyword;
}

export function createErrorsTransformer(options: ErrorsTransformerOptions) {
  const extractPropertyTitle = (
    rootSchema: Schema,
    instance: Path,
    schemaPath: Path,
    error: ValidationError
  ): string => {
    let title = getUiSchemaByPath(options.uiSchema, instance)?.["ui:options"]
      ?.title;
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
  return (rootSchema: Schema, errors: ValidationError[]) =>
    errors.map((error) => {
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
}
