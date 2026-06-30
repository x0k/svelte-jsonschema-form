// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isSelect.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isMultiSelect.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { isSchemaObject } from "@/lib/json-schema/index.js";

import {
  getSchemaConstantValueSafe,
  isSchemaOfConstantValue,
} from "./constant-schema.js";
import type { Merger } from "./merger.js";
import { retrieveSchema } from "./resolve.js";
import type { Schema, SchemaValue } from "./schema.js";
import type { Validator } from "./validator.js";
import { isSchemaObjectValue } from "./value.js";

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
export function isSelect(
  validator: Validator,
  merger: Merger,
  theSchema: Schema,
  rootSchema: Schema
) {
  const schema = retrieveSchema(validator, merger, theSchema, rootSchema);
  if (Array.isArray(schema.enum)) {
    return true;
  }
  const altSchemas = schema.oneOf || schema.anyOf;
  if (Array.isArray(altSchemas)) {
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
export function getSelectOptionValuesSafe({
  enum: enumValues,
  oneOf,
  anyOf,
}: Schema): SchemaValue[] | undefined {
  if (enumValues !== undefined) {
    return enumValues;
  }
  const altSchema = oneOf ?? anyOf;
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

/** @deprecated use `getSelectOptionValuesSafe` */
export function getSelectOptionValues(
  schema: Schema
): SchemaValue[] | undefined {
  const values = getSelectOptionValuesSafe(schema);
  if (values === undefined) {
    throw new Error(`Invalid enum definition in altSchema.`);
  }
  return values.length > 0 ? values : undefined;
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
  validator: Validator,
  merger: Merger,
  { items, uniqueItems }: Schema,
  rootSchema: Schema
): boolean {
  return (
    uniqueItems === true &&
    isSchemaObjectValue(items) &&
    isSelect(validator, merger, items, rootSchema)
  );
}
