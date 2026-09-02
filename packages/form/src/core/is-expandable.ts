import { isNil } from "@/lib/types.js";

import type { Schema, SchemaObjectValue } from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

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
