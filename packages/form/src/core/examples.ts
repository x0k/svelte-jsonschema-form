import type { Schema } from "./schema.js";

/**
 * Returns the suggestions a text input offers for `schema`: its `examples` and
 * `default` as the strings a `<datalist>` can suggest. Examples and a default
 * that share a `String()` are one suggestion, and `null`, objects and arrays
 * are left out.
 */
export function getExampleSuggestions({
  examples,
  default: schemaDefault,
}: Schema): Set<string> {
  const suggestions = new Set<string>();
  if (!Array.isArray(examples)) {
    return suggestions;
  }
  for (const value of examples) {
    if (typeof value !== "object") {
      suggestions.add(String(value));
    }
  }
  if (schemaDefault !== undefined && typeof schemaDefault !== "object") {
    suggestions.add(String(schemaDefault));
  }
  return suggestions;
}
