// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/hashForSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { Schema } from "./schema.js";

function hashString(string: string): string {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    const chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

function shouldIncludeValue(value: unknown) {
  return (
    value !== undefined &&
    typeof value !== "function" &&
    typeof value !== "symbol"
  );
}

/**
 * Recursively serializes a value to JSON with object keys sorted alphabetically
 * to produce a stable string representation.
 *
 * Array items are kept in place, and `undefined` items are written as
 * `undefined` so they do not collapse into `null`.
 */
function sortedJSONStringify(object: unknown): string {
  if (Array.isArray(object)) {
    return `[${object
      .map((value) =>
        value === undefined ? "undefined" : sortedJSONStringify(value)
      )
      .join(",")}]`;
  }
  if (object === null || typeof object !== "object") {
    // JSON.stringify normalizes functions to null.
    return JSON.stringify(typeof object === "function" ? null : object);
  }
  const record = object as Record<string, unknown>;
  const values: string[] = [];
  for (const key of Object.keys(record).sort()) {
    const value = record[key];
    if (shouldIncludeValue(value)) {
      values.push(`${JSON.stringify(key)}:${sortedJSONStringify(value)}`);
    }
  }
  return `{${values.join(",")}}`;
}

export function schemaHash(schema: Schema) {
  return hashString(sortedJSONStringify(schema));
}
