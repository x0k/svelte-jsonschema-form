import { merge as allOfMerge } from "allof-merge";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import jsonSchemaMergeAllOf, { type Options } from "json-schema-merge-allof";
import { describe, test } from "vitest";

import { createDeduplicator, createIntersector } from "@/lib/array.js";
import { createComparator } from "@/lib/json-schema/compare/index.js";

import {
  createDeepAllOfMerge,
  createShallowAllOfMerge,
} from "./all-of-merge.js";
import testData from "./fixtures/data.json" with { type: "json" };
import userSchema from "./fixtures/user-schema.json" with { type: "json" };
import { createMerger } from "./merge.js";

const { compareSchemaValues, compareSchemaDefinitions } = createComparator();

const { mergeArrayOfSchemaDefinitions } = createMerger({
  intersectJson: createIntersector(compareSchemaValues),
  deduplicateJsonSchemaDef: createDeduplicator(compareSchemaDefinitions),
});
const shallowAllOfMerge = createShallowAllOfMerge(
  mergeArrayOfSchemaDefinitions
);

const {
  mergeArrayOfSchemaDefinitions: mergeArrayOfSchemaDefinitionsWithoutChecks,
} = createMerger({
  intersectJson: createIntersector(compareSchemaValues),
  deduplicateJsonSchemaDef: createDeduplicator(compareSchemaDefinitions),
  // NOTE: We disable checks in order to get at least some result, otherwise there will be an error.
  checks: [],
});
const shallowAllOfMergeWithoutChecks = createShallowAllOfMerge(
  mergeArrayOfSchemaDefinitionsWithoutChecks
);
const deepAllOfMerge = createDeepAllOfMerge(shallowAllOfMergeWithoutChecks);

const toSkip = new Set(["a13", "a17", "a19", "a20", "a21", "a22"]);

describe("shallow merge", () => {
  for (const [name, data] of Object.entries(testData.properties)) {
    test(name, async ({ bench }) => {
      const benches: any[] = [
        bench("shallowAllOfMerge", () => {
          shallowAllOfMerge(data as JSONSchema7Definition);
        }),
        // NOTE: Performs deep merge by default; comparison may be incorrect.
        bench("allof-merge", () => {
          allOfMerge(data);
        }),
      ];
      if (!toSkip.has(name)) {
        benches.push(
          bench("json-schema-merge-allof", () => {
            jsonSchemaMergeAllOf(
              data as JSONSchema7,
              { deep: false } as Options
            );
          })
        );
      }
      await bench.compare(...benches);
    });
  }
});

test("huge shallow merge", async ({ bench }) => {
  await bench.compare(
    bench("shallowAllOfMerge", () => {
      shallowAllOfMerge(userSchema as unknown as JSONSchema7);
    }),
    bench("json-schema-merge-allof", () => {
      jsonSchemaMergeAllOf(userSchema as unknown as JSONSchema7);
    }),
    bench("allof-merge", () => {
      allOfMerge(userSchema);
    })
  );
});

test("deep merge", async ({ bench }) => {
  await bench.compare(
    bench("deepAllOfMerge", () => {
      deepAllOfMerge(testData as unknown as JSONSchema7);
    }),
    bench("json-schema-merge-allof", () => {
      jsonSchemaMergeAllOf(testData as unknown as JSONSchema7);
    }),
    bench("allof-merge", () => {
      allOfMerge(testData);
    })
  );
});
