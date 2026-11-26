import { isNil } from "#lib/types.js";

import { additionalPropertiesKeyword } from "./additional-properties.js";
import type { Schema, SchemaObjectValue } from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

export function isObjectSchemaExpandable(
  schema: Schema,
  formData: SchemaObjectValue | null | undefined
): boolean {
  return (
    (additionalPropertiesKeyword(schema) ||
      schema.patternProperties !== undefined) &&
    (isNil(formData) ||
      (isSchemaObjectValue(formData) &&
        (schema.maxProperties === undefined ||
          Object.keys(formData).length < schema.maxProperties)))
  );
}
