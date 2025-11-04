import type { ValidationError } from "@exodus/schemasafe";
import { getValueByPath } from "@sjsf/form/lib/object";
import {
  getSchemaDefinitionByPath,
  pathFromLocation,
  pathFromRef,
  type Merger,
  type Path,
} from "@sjsf/form/core";
import type {
  Config,
  FieldValue,
  FormValue,
  Schema,
  ValidationResult,
  Validator,
} from "@sjsf/form";

function extractKeywordValue(
  validator: Validator,
  merger: Merger,
  keyword: string,
  rootSchema: Schema,
  instancePath: Path,
  schemaPath: Path,
  value: FieldValue
) {
  const schema = getValueByPath(rootSchema, schemaPath);
  if (schema && typeof schema === "object" && keyword in schema) {
    return String((schema as Record<string, unknown>)[keyword]);
  }
  const def = getSchemaDefinitionByPath(
    validator,
    merger,
    rootSchema,
    rootSchema,
    instancePath,
    value
  );
  if (typeof def === "object" && def[keyword as keyof Schema] !== undefined) {
    return String(def[keyword as keyof Schema]);
  }
}

function transformError(
  { instanceLocation, keywordLocation }: ValidationError,
  data: unknown
) {
  const instancePath = pathFromLocation(instanceLocation, data);
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

export function transformFormErrors<T>(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  errors: ValidationError[] | undefined,
  data: FormValue
): ValidationResult<T> {
  // NOTE: According to the compiled output of `schemasafe`
  // errors can be `null`
  if (!errors || errors.length === 0) {
    return {
      value: data as T,
    };
  }
  return {
    value: data,
    errors: errors.map((error) => {
      const { instancePath, schemaPath, keyword } = transformError(error, data);
      return {
        path: instancePath,
        message: createErrorMessage(
          keyword,
          extractKeywordValue(
            validator,
            merger,
            keyword,
            rootSchema,
            instancePath,
            schemaPath,
            data
          )
        ),
      };
    }),
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
  errors: ValidationError[] | undefined,
  data: unknown
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
        const { keyword } = transformError(error, data);
        return createErrorMessage(
          keyword,
          field.schema?.[keyword as keyof Schema]?.toString()
        );
      }) ?? []
  );
}
