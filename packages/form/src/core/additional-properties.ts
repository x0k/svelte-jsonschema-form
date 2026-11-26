// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/2abc47fa756db6b3a815a9476872df27b51cbfcb/packages/utils/src/additionalPropertiesUtils.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { ALL_OF_KEY, type Schema, type SchemaDefinition } from "./schema.js";

// A schema names a few patterns where the keys tested against them are the
// form data's, so compile each pattern once rather than on every render/prune.
const compiledPatterns = new Map<string, RegExp>();

export function patternRegExp(pattern: string): RegExp {
  const cached = compiledPatterns.get(pattern);
  if (cached !== undefined) {
    return cached;
  }
  let compiled: RegExp;
  try {
    // Ajv compiles patterns with `unicodeRegExp` on by default, so `\p{Lu}`
    // must not read as the literal text `p{Lu}`.
    compiled = new RegExp(pattern, "u");
  } catch {
    // A pattern the `u` flag rejects is compiled unflagged rather than
    // throwing out of every render of the object that names it.
    compiled = new RegExp(pattern);
  }
  compiledPatterns.set(pattern, compiled);
  return compiled;
}

// CHANGED: upstream #5429 takes the schema and reads its `patternProperties`
// here; v4 keeps the existing `(patternProperties, key)` signature.
export function getMatchingPatternProperties(
  patternProperties: Exclude<Schema["patternProperties"], undefined>,
  key: string
): SchemaDefinition[] {
  const schemas: SchemaDefinition[] = [];
  for (const [pattern, schema] of Object.entries(patternProperties)) {
    if (patternRegExp(pattern).test(key)) {
      schemas.push(schema);
    }
  }
  return schemas;
}

/** Reads `additionalProperties`, or `unevaluatedProperties` where the former is
 * absent. A keyword spelled `undefined` reads as absent, so `false` is kept. */
export function additionalPropertiesKeyword(
  schema: Schema
): SchemaDefinition | undefined {
  return schema.additionalProperties ?? schema.unevaluatedProperties;
}

/** The schema an object says applies to a key its `properties` do not name: all
 * matching patterns together, or the extra-key keyword. `false` forbids the
 * key and `true` allows it without describing its value. */
export function getAdditionalPropertySchema(
  schema: Schema,
  key: string
): SchemaDefinition {
  if (schema.patternProperties !== undefined) {
    const matching = getMatchingPatternProperties(
      schema.patternProperties,
      key
    );
    if (matching.length > 0) {
      return matching.includes(false)
        ? false
        : ({ [ALL_OF_KEY]: matching } as Schema);
    }
  }
  return additionalPropertiesKeyword(schema) ?? true;
}
