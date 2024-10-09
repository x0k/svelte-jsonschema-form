// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isSelect.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isMultiSelect.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { Schema } from "./schema.js";
import type { Validator } from "./validator.js";
import { retrieveSchema } from "./resolve.js";
import { isSchemaOfConstantValue } from "./constant-schema.js";

export function isSelect(
  validator: Validator,
  theSchema: Schema,
  rootSchema: Schema
) {
  const schema = retrieveSchema(validator, theSchema, rootSchema);
  if (Array.isArray(schema.enum)) {
    return true;
  }
  const altSchemas = schema.oneOf || schema.anyOf;
  if (Array.isArray(altSchemas)) {
    return altSchemas.every(
      (altSchemas) =>
        typeof altSchemas !== "boolean" && isSchemaOfConstantValue(altSchemas)
    );
  }
  return false;
}

export function isMultiSelect(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema
) {
  const items = schema.items;
  if (
    !items ||
    typeof items === "boolean" ||
    // TODO: This condition is added to satisfy TS and it looks correct.
    // But this check is missing in the original code.
    // Therefore, clarify the term `multi-select` schema
    Array.isArray(items) ||
    !schema.uniqueItems
  ) {
    return false;
  }
  return isSelect(validator, items, rootSchema);
}
