import mergeAllOf, { type Options } from "json-schema-merge-allof";

import type { Schema, SchemaValue } from "./schema.js";

export interface Merger2 {
  /**
   * Merges schema and its `allOf` schemas into a single schema
   */
  mergeAllOf(schema: Schema): Schema;
}

/**
 * @deprecated use `Merger2`
 */
export interface Merger extends Merger2 {
  /**
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    formData: SchemaValue | undefined,
    schema: Schema
  ): SchemaValue | undefined;
}

export const defaultMerger: Merger2 = {
  mergeAllOf(schema) {
    return mergeAllOf(schema, { deep: false } as Options) as Schema;
  },
};
