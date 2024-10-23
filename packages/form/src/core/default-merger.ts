import mergeAllOf, { type Options } from "json-schema-merge-allof";

import type { Merger } from "./merger.js";
import type { Schema } from "./schema.js";

export const defaultMerger: Merger = {
  mergeAllOf(schema) {
    return mergeAllOf(schema, {
      deep: false,
    } as Options) as Schema;
  },
};
