import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { isAllowAnySchema } from "@/lib/json-schema.js";

import type { Merger } from "./json-schema-merge.js";

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

export function createMergeAllOf(mergeSchemas: Merger<JSONSchema7>) {
  function mergeArrayOfSchemaDefinitions(
    schemas: JSONSchema7Definition[]
  ): JSONSchema7Definition {
    let wIndex = 0;
    for (let i = 0; i < schemas.length; i++) {
      const item = schemas[i]!;
      if (item === false) {
        return false;
      }
      if (!isAllowAnySchema(item)) {
        if (wIndex !== i) {
          schemas[wIndex] = item;
        }
        wIndex++;
      }
    }
    if (wIndex === 0) {
      return schemas[0]!;
    }
    let result = schemas[0] as JSONSchema7;
    for (let i = 1; i < wIndex; i++) {
      result = mergeSchemas(result, schemas[i] as JSONSchema7);
    }
    return result;
  }
  return (schema: JSONSchema7Definition) =>
    mergeArrayOfSchemaDefinitions(getAllOfSchemas(schema));
}
