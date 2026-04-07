import { isNil } from "@/lib/types.js";

import type { Schema, SchemaObjectValue, SchemaValue } from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

// TODO: Remove in v4
/** @deprecated use `isObjectSchemaExpandable` instead */
export function isSchemaExpandable(
  schema: Schema,
  formData: SchemaValue | undefined
): schema is Omit<Schema, "additionalProperties"> & {
  additionalProperties: Schema;
} {
  return (
    (isSchemaObjectValue(schema.additionalProperties) ||
      schema.patternProperties !== undefined) &&
    isSchemaObjectValue(formData) &&
    (schema.maxProperties === undefined ||
      Object.keys(formData).length < schema.maxProperties)
  );
}

export function isObjectSchemaExpandable(
  schema: Schema,
  formData: SchemaObjectValue | null | undefined
): boolean {
  return (
    (isSchemaObjectValue(schema.additionalProperties) ||
      schema.patternProperties !== undefined) &&
    (isNil(formData) ||
      (isSchemaObjectValue(formData) &&
        (schema.maxProperties === undefined ||
          Object.keys(formData).length < schema.maxProperties)))
  );
}
