import type { Schema, SchemaValue } from "./schema.js";

export interface Merger {
  /**
   * Merges schema and its `allOf` schemas into a single schema
   */
  mergeAllOf(schema: Schema): Schema;
  /**
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    formData: SchemaValue | undefined,
    schema: Schema
  ): SchemaValue | undefined;
}
