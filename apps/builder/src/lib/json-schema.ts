import type { Schema } from "@sjsf/form";
import { createMerger } from "@sjsf/form/lib/json-schema";

const { mergeSchemaDefinitions } = createMerger();

export function mergeSchemas(a: Schema, b: Schema): Schema {
  return mergeSchemaDefinitions(a, b) as Schema;
}
