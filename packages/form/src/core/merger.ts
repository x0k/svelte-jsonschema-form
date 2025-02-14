import mergeAllOf, { type Options } from "json-schema-merge-allof";

import type { Schema } from "./schema.js";

export interface Merger {
  /**
   * Merges schema and its `allOf` schemas into a single schema
   */
  mergeAllOf(schema: Schema): Schema;
}

export const defaultMerger: Merger = {
  mergeAllOf(schema) {
    return mergeAllOf(schema, { deep: false } as Options) as Schema;
  },
};
