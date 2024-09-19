import type { Schema } from "./schema";
import type { Validator } from "./validator";
import { retrieveSchema } from "./resolve";
import { isSchemaOfConstantValue } from "./is-constant-schema";

export function isSelect<T>(
  validator: Validator<T>,
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
