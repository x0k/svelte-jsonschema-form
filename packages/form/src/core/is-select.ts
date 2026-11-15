// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isSelect.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isMultiSelect.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { isSchemaObject } from "#lib/json-schema/index.js";

import {
  getSchemaConstantValueSafe,
  isSchemaOfConstantValue,
} from "./constant-schema.js";
import type { CoreContext } from "./context.js";
import { retrieveSchema } from "./resolve.js";
import type { Schema, SchemaValue } from "./schema.js";
import { isSchemaObjectValue } from "./value.js";
import { getXxxOfOptions } from "./xxx-of-options.js";

/**
 * Detects `select` schema
 * - Schema contains `enum` property
 * - Or schemas in `oneOf || anyOf` are `constant`
 * @example
 *
 * ```json
 * {
 *   "enum": [
 *     "foo",
 *     "bar"
 *   ]
 * }
 * ```
 *
 * @example
 *
 * ```json
 * {
 *   "oneOf": [
 *     { "const": "foo" },
 *     { "enum": ["bar"] }
 *   ]
 * }
 * ```
 */
export function isSelect(ctx: CoreContext, theSchema: Schema) {
  const schema = retrieveSchema(ctx, theSchema);
  if (Array.isArray(schema.enum)) {
    return true;
  }
  const altSchemas = getXxxOfOptions(schema)?.options;
  if (altSchemas !== undefined) {
    return altSchemas.every(
      (altSchemas) =>
        typeof altSchemas !== "boolean" && isSchemaOfConstantValue(altSchemas)
    );
  }
  return false;
}

/**
 * @returns `undefined` for non select schemas
 */
export function getSelectOptionValuesSafe(
  schema: Schema
): SchemaValue[] | undefined {
  const enumValues = schema.enum;
  if (enumValues !== undefined) {
    return enumValues;
  }
  const altSchema = getXxxOfOptions(schema)?.options;
  if (altSchema === undefined) {
    return [];
  }
  const values: SchemaValue[] = [];
  for (const schemaDef of altSchema) {
    if (!isSchemaObject(schemaDef)) {
      return undefined;
    }
    const v = getSchemaConstantValueSafe(schemaDef);
    if (v === undefined) {
      return undefined;
    }
    values.push(v);
  }
  return values;
}

/**
 * Detects `multi select` schema
 * - Array with unique items
 * - Items is `select` schema
 * @example
 *
 * ```json
 * {
 *   "type": "array",
 *   "uniqueItems": true,
 *   "items": {
 *     "enum": [
 *       "foo",
 *       "bar"
 *     ]
 *   }
 * }
 * ```
 */
export function isMultiSelect(
  ctx: CoreContext,
  { items, uniqueItems }: Schema
): boolean {
  return (
    uniqueItems === true && isSchemaObjectValue(items) && isSelect(ctx, items)
  );
}
