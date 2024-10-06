import type { Schema } from './schema';

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
