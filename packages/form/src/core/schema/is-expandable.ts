import type { Schema, SchemaValue } from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

export function isSchemaExpandable(
  schema: Schema,
  formData: SchemaValue | undefined
): schema is Omit<Schema, "additionalProperties"> & {
  additionalProperties: Schema;
} {
  return (
    isSchemaObjectValue(schema.additionalProperties) &&
    isSchemaObjectValue(formData) &&
    (schema.maxProperties === undefined ||
      Object.keys(formData).length < schema.maxProperties)
  );
}
