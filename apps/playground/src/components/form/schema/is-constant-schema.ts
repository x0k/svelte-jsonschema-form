import type { Schema } from "./schema";

export function isSchemaOfConstantValue(schema: Schema): boolean {
  return (
    schema.const !== undefined ||
    (Array.isArray(schema.enum) && schema.enum.length === 1)
  );
}
