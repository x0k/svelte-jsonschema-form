import type { Json, Validate, ValidationError } from "@exodus/schemasafe";
import type {
  Config,
  FieldValue,
  FormValue,
  Schema,
  ValidationResult,
  Validator,
} from "@sjsf/form";
import {
  ALL_OF_KEY,
  ANY_OF_KEY,
  getSchemaDefinitionByPath,
  ITEMS_KEY,
  ONE_OF_KEY,
  pathFromLocation,
  pathFromRef,
  REF_KEY,
  resolveRef,
  type Merger,
  type Path,
} from "@sjsf/form/core";
import { getValueByPath } from "@sjsf/form/lib/object";

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

interface CombinationLocation {
  /** Path index of the `anyOf` or `oneOf` keyword. */
  index: number;
  schema: Schema;
}

const SCHEMA_MAP_KEYWORDS = new Set([
  "$defs",
  "definitions",
  "properties",
  "patternProperties",
  "dependencies",
  "dependentSchemas",
]);

const SUB_SCHEMA_KEYWORDS = new Set([
  "additionalItems",
  "additionalProperties",
  "contains",
  "contentSchema",
  "else",
  "if",
  "not",
  "propertyNames",
  "then",
  "unevaluatedItems",
  "unevaluatedProperties",
]);

const PREFIX_ITEMS_KEY = "prefixItems";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isArrayIndex(key: string | number) {
  return typeof key === "number" || /^\d+$/.test(key);
}

/**
 * Collects the `anyOf`/`oneOf` keywords that are actually part of the schema
 * path, resolving local `$ref`s along the way.
 *
 * This is needed to distinguish a combination keyword from a property with the
 * same name (for example `#/properties/oneOf/type`).
 */
function collectCombinations(
  rootSchema: Schema,
  path: Path
): CombinationLocation[] {
  const combinations: CombinationLocation[] = [];
  let node: unknown = rootSchema;
  let i = 0;
  while (i < path.length) {
    if (!isRecord(node)) {
      break;
    }
    const key = path[i]!;
    if (key === REF_KEY) {
      const ref = node[REF_KEY];
      if (typeof ref === "string") {
        try {
          node = resolveRef(ref, rootSchema);
        } catch {
          // External references cannot be resolved here
          break;
        }
      }
      // A `$ref` that is absent from the schema is a fragment boundary
      // inserted by the precompiled validator. The fragment has the same
      // structure as the original schema, so keep walking the current node.
      i++;
      continue;
    }
    if (key === ANY_OF_KEY || key === ONE_OF_KEY) {
      const branches = node[key];
      if (!Array.isArray(branches) || branches.length < 2) {
        break;
      }
      combinations.push({ index: i, schema: node as Schema });
      if (i + 1 >= path.length) {
        break;
      }
      node = branches[path[i + 1] as number];
      i += 2;
      continue;
    }
    if (SCHEMA_MAP_KEYWORDS.has(key as string)) {
      const map = node[key];
      if (!isRecord(map) || i + 1 >= path.length) {
        break;
      }
      node = map[path[i + 1]!];
      i += 2;
      continue;
    }
    if (key === ALL_OF_KEY) {
      const branches = node[key];
      if (!Array.isArray(branches) || i + 1 >= path.length) {
        break;
      }
      node = branches[path[i + 1] as number];
      i += 2;
      continue;
    }
    if (key === ITEMS_KEY) {
      const items = node[key];
      if (Array.isArray(items) && i + 1 < path.length) {
        node = items[path[i + 1] as number];
        i += 2;
      } else {
        node = items;
        i++;
      }
      continue;
    }
    // `schemasafe` omits the `items`/`prefixItems` keyword for tuple entries
    // in `keywordLocation` (for example `#/properties/tuple/0/anyOf`).
    if (isArrayIndex(key)) {
      const items = node[ITEMS_KEY];
      const tuple = Array.isArray(items) ? items : node[PREFIX_ITEMS_KEY];
      if (!Array.isArray(tuple)) {
        break;
      }
      node = tuple[Number(key)];
      i++;
      continue;
    }
    if (SUB_SCHEMA_KEYWORDS.has(key as string)) {
      node = node[key];
      i++;
      continue;
    }
    break;
  }
  return combinations;
}

function isInstanceWithin(instanceLocation: string, prefix: string) {
  return (
    instanceLocation === prefix ||
    instanceLocation.startsWith(prefix === "#" ? "#/" : `${prefix}/`)
  );
}

/**
 * `schemasafe` emits errors from failed `anyOf`/`oneOf` branches before it
 * knows whether the combination as a whole succeeds. When the combination
 * succeeds, those branch errors stay in `validate.errors`, so they must be
 * removed. A failed combination always emits an error at the combination
 * itself, which keeps its branch errors.
 *
 * Combinations with `discriminator` are special: only the selected branch is
 * validated, so its errors are real even though no combination error is
 * emitted.
 */
function filterStaleErrors(
  rootSchema: Schema,
  errors: ValidationError[] | undefined
): ValidationError[] | undefined {
  if (!errors || errors.length === 0) {
    return errors;
  }
  // A combination can be applied to multiple values (for example, every item
  // of an array), so a failed branch in one value must not keep errors from a
  // successful branch in another value.
  const combinationInstances = new Map<string, string[]>();
  for (const { keywordLocation, instanceLocation } of errors) {
    const instances = combinationInstances.get(keywordLocation);
    if (instances === undefined) {
      combinationInstances.set(keywordLocation, [instanceLocation]);
    } else {
      instances.push(instanceLocation);
    }
  }
  return errors.filter((error) => {
    const rawParts = error.keywordLocation.split("/");
    const combinations = collectCombinations(
      rootSchema,
      pathFromRef(error.keywordLocation)
    );
    return combinations.every(({ index, schema }) => {
      if (schema.discriminator !== undefined) {
        return true;
      }
      const combinationLocation = rawParts.slice(0, index + 2).join("/");
      return (
        combinationInstances
          .get(combinationLocation)
          ?.some((instanceLocation) =>
            isInstanceWithin(error.instanceLocation, instanceLocation)
          ) ?? false
      );
    });
  });
}

/**
 * `schemasafe` can leave errors from failed `anyOf`/`oneOf` branches on the
 * validate function even when validation succeeds (for example, when
 * `allErrors` is enabled). The boolean result is the source of truth.
 */
export function validateAndGetErrors(validate: Validate, value: Json) {
  return validate(value) ? undefined : validate.errors;
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
  const filteredErrors = filterStaleErrors(rootSchema, errors);
  if (!filteredErrors || filteredErrors.length === 0) {
    return {
      value: data as T,
    };
  }
  return {
    value: data,
    errors: filteredErrors.map((error) => {
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
  const filteredErrors = filterStaleErrors(field.schema, errors);
  if (!filteredErrors) {
    return [];
  }
  return (
    filteredErrors
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
