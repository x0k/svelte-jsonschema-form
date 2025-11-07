import {
  isSchemaObject,
  transformSchemaDefinition,
} from "@/lib/json-schema/index.js";

import { REF_KEY, type Schema, type SchemaDefinition } from "./schema.js";

export function prefixSchemaRefs(schema: Schema, prefix: string): Schema {
  return transformSchemaDefinition<SchemaDefinition>(schema, (node) => {
    if (!isSchemaObject(node)) {
      return node;
    }
    const ref = node[REF_KEY];
    if (ref?.startsWith("#")) {
      node[REF_KEY] = `${prefix}${ref}`;
    }
    return node;
  }) as Schema;
}
