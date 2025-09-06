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

export function schemaHash(schema: Schema) {
  const allKeys = new Set<string>();
  // solution source: https://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify/53593328#53593328
  JSON.stringify(schema, (key, value) => (allKeys.add(key), value));
  return hashString(JSON.stringify(schema, Array.from(allKeys).sort()));
}
