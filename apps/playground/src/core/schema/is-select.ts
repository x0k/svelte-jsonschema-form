import type { Schema } from "./schema";
import type { Validator } from "./validator";
import { retrieveSchema } from "./resolve";
import { isSchemaOfConstantValue } from "./constant";

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
