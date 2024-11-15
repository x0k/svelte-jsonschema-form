import {
  type SchemaDefinition,
  type Schema,
  isSchema,
  REF_KEY,
} from "./schema.js";
import { transformSchemaDefinition } from "./schema-transformer.js";

export function prefixSchemaRefs(schema: Schema, prefix: string): Schema {
  return transformSchemaDefinition<SchemaDefinition>(schema, (node) => {
    if (!isSchema(node)) {
      return node;
    }
    const ref = node[REF_KEY];
    if (ref !== undefined && ref.startsWith("#")) {
      node[REF_KEY] = `${prefix}${ref}`;
    }
    return node;
  }) as Schema;
}
