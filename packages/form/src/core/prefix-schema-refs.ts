import {
  isSchemaObject,
  transformSchemaDefinition,
} from "@/lib/json-schema/index.js";

import { type SchemaDefinition, type Schema, REF_KEY } from "./schema.js";

export function updateSchemaRefs(
  schema: Schema,
  update: (ref: string) => string
): Schema {
  return transformSchemaDefinition<SchemaDefinition>(schema, (node) => {
    if (!isSchemaObject(node)) {
      return node;
    }
    const ref = node[REF_KEY];
    if (ref !== undefined) {
      node[REF_KEY] = update(ref);
    }
    return node;
  }) as Schema;
}

/**
 * Prefixes local (`#`-anchored) refs of the schema with the given prefix.
 * A more general alternative is `updateSchemaRefs`.
 */
export function prefixSchemaRefs(schema: Schema, prefix: string): Schema {
  return updateSchemaRefs(schema, (ref) =>
    ref.startsWith("#") ? `${prefix}${ref}` : ref
  );
}
