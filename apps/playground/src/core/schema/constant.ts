import type { Schema } from "./schema";

export function isSchemaOfConstantValue(schema: Schema): boolean {
  return (
    schema.const !== undefined ||
    (Array.isArray(schema.enum) && schema.enum.length === 1)
  );
}

export function getSchemaConstantValue(schema: Schema) {
  const enumValues = schema.enum
  if (Array.isArray(enumValues) && enumValues.length === 1) {
    return enumValues[0];
  }
  const constant = schema.const
  if (constant !== undefined) {
    return constant
  }
  throw new Error('schema cannot be inferred as a constant');
}
