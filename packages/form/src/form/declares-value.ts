// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/6b0c71d5/packages/core/src/components/declaresValue.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  CONST_KEY,
  DEFAULT_KEY,
  isSchemaObjectValue,
  type Schema,
} from "#core/index.js";
import { getOwn } from "#lib/object.js";

/** Determines whether `schema` declares a value of its own, which is what a schema that is not an object has instead
 * of a per-property declaration.
 *
 * @param schema - The schema to test
 * @returns - True when the schema declares a `default` or `const`
 */
export function declaresOwnValue(schema: Schema): boolean {
  return Object.hasOwn(schema, DEFAULT_KEY) || Object.hasOwn(schema, CONST_KEY);
}

/** Determines whether `level` declares a value for `key`, either on the property's own resolved schema or in the
 * level's own `default` object.
 *
 * The computed defaults are no guide on their own, which is the whole reason this exists: the defaults computation also
 * returns a nested object's leaf defaults, `{}` for a required object, `[]` for a required array, `false` for a
 * required boolean and an `items` default repeated up to `minItems`. None of those is the level saying what the key
 * should hold, so treating them as such replaces a value the user is still holding.
 *
 * @param level - The schema declaring `key`, whose own `default` may name it
 * @param key - The name of the property to test
 * @param keySchema - `key`'s resolved schema, already resolved by the caller
 * @returns - True when a `default` or `const` is declared for `key`
 */
export function declaresValueFor(
  level: Schema,
  key: string,
  keySchema: Schema
): boolean {
  if (declaresOwnValue(keySchema)) {
    return true;
  }
  const levelDefault = getOwn(level, DEFAULT_KEY);
  // `Object.hasOwn()`, so a property named `constructor` or `toString` is not answered for by the member every object
  // inherits under that name
  return isSchemaObjectValue(levelDefault) && Object.hasOwn(levelDefault, key);
}
