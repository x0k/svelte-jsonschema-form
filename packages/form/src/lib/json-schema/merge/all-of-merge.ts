import type { JSONSchema7Definition } from "json-schema";

import { transformSchemaDefinition } from "@/lib/json-schema/transform.js";

function getAllOfSchemas(
  schema: JSONSchema7Definition
): JSONSchema7Definition[] {
  const result: JSONSchema7Definition[] = [];
  const stack: JSONSchema7Definition[] = [schema];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (typeof current === "boolean" || current.allOf === undefined) {
      result.push(current);
      continue;
    }
    const { allOf, ...rest } = current;
    result.push(rest);
    for (let i = allOf.length - 1; i >= 0; i--) {
      stack.push(allOf[i]!);
    }
  }
  return result;
}

export function createShallowAllOfMerge(
  mergeArrayOfSchemaDefinitions: (
    defs: JSONSchema7Definition[]
  ) => JSONSchema7Definition
) {
  return (schema: JSONSchema7Definition) =>
    mergeArrayOfSchemaDefinitions(getAllOfSchemas(schema));
}

export function createDeepAllOfMerge(
  shallowMerge: (def: JSONSchema7Definition) => JSONSchema7Definition
) {
  return (schemaDef: JSONSchema7Definition) =>
    transformSchemaDefinition<JSONSchema7Definition>(schemaDef, (def) => {
      if (typeof def === "boolean" || def.allOf === undefined) {
        return def;
      }
      return shallowMerge(def);
    });
}
