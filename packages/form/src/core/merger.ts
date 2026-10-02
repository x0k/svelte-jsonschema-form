import type { ValueComparer } from "./deep-equal.js";
import type { Schema } from "./schema.js";

export interface Merger extends ValueComparer {
  mergeSchemas(a: Schema, b: Schema): Schema;
  /**
   * Merges schema and its `allOf` schemas into a single schema
   */
  mergeAllOf(schema: Schema): Schema;
}
