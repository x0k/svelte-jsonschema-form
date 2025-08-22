import { isSchemaDeepEqual } from "./deep-equal.js";
import type { Merger } from "./merger.js";
import type { Schema } from "./schema.js";

export function createMerger({
  merges = [],
  allOfMerges = [],
}: {
  merges?: {
    left: Schema;
    right: Schema;
    result: Schema;
  }[];
  allOfMerges?: {
    input: Schema;
    result: Schema;
  }[];
} = {}): Merger {
  return {
    mergeAllOf(schema) {
      const c = allOfMerges.find((c) => isSchemaDeepEqual(c.input, schema));
      if (c === undefined) {
        throw new Error(
          `Cannot find allOfMerge case with ${JSON.stringify({ input: schema })}`
        );
      }
      return c.result;
    },
    mergeSchemas(a, b) {
      const c = merges.find(
        (c) => isSchemaDeepEqual(c.left, a) && isSchemaDeepEqual(c.right, b)
      );
      if (c === undefined) {
        // console.log({ merges, a, b });
        throw new Error(
          `Cannot find merge case with ${JSON.stringify({ left: a, right: b })}`
        );
      }
      return c.result;
    },
  };
}
