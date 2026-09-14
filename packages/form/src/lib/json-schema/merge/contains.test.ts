import { Ajv } from "ajv";
import type { JSONSchema7Definition } from "json-schema";
import { describe, expect, it } from "vitest";

import { createDeduplicator, createIntersector } from "@/lib/array.js";
import { createComparator } from "@/lib/json-schema/compare/index.js";

import {
  createDeepAllOfMerge,
  createShallowAllOfMerge,
} from "./all-of-merge.js";
import { createMerger } from "./merge.js";

const { compareSchemaValues, compareSchemaDefinitions } = createComparator();

const { mergeArrayOfSchemaDefinitions, mergeSchemaDefinitions } = createMerger({
  intersectJson: createIntersector(compareSchemaValues),
  deduplicateJsonSchemaDef: createDeduplicator(compareSchemaDefinitions),
});

const shallowAllOfMerge = createShallowAllOfMerge(
  mergeArrayOfSchemaDefinitions
);
const deepAllOfMerge = createDeepAllOfMerge(shallowAllOfMerge);

const ajv = new Ajv({ strict: false });

function expectEquivalent(
  original: JSONSchema7Definition,
  merged: JSONSchema7Definition,
  instances: unknown[]
) {
  const validateOriginal = ajv.compile(original);
  const validateMerged = ajv.compile(merged);
  for (const instance of instances) {
    expect(
      validateMerged(instance),
      `merged schema disagrees on ${JSON.stringify(instance)}`
    ).toBe(validateOriginal(instance));
  }
}

describe("contains", () => {
  it("preserves conjunction of two distinct contains as root plus allOf", () => {
    const c1 = { properties: { a: { pattern: "1" } } };
    const c2 = { properties: { a: { pattern: "2" } } };
    const result = shallowAllOfMerge({
      allOf: [{ contains: c1 }, { contains: c2 }],
    });

    // Like `if`/`then`/`else`: left stays at root, right moves to `allOf`.
    expect(result).toEqual({
      contains: c1,
      allOf: [{ contains: c2 }],
    });
  });

  it("keeps rjsf-team/react-jsonschema-form#5288 semantics", () => {
    const original = {
      allOf: [
        { contains: { properties: { a: { pattern: "1" } } } },
        { contains: { properties: { a: { pattern: "2" } } } },
      ],
    };
    const merged = shallowAllOfMerge(original);

    // The old (incorrect) merge collapsed into a single `contains`
    // requiring one item to match both patterns.
    expect(merged).toEqual({
      contains: { properties: { a: { pattern: "1" } } },
      allOf: [{ contains: { properties: { a: { pattern: "2" } } } }],
    });

    // Two separate witnesses satisfy the original and must satisfy the merge.
    expectEquivalent(original, merged, [
      [{ a: "1" }, { a: "2" }],
      [{ a: "1" }],
      [{ a: "2" }],
      [{ a: "12" }],
      [{ a: "other" }],
      [],
      {},
      "not an array",
    ]);

    // Explicit regression: distinct witnesses must be accepted.
    const validate = ajv.compile(merged);
    expect(validate([{ a: "1" }, { a: "2" }])).toBe(true);
    expect(validate([{ a: "1" }])).toBe(false);
  });

  it("passes a single contains through", () => {
    expect(
      shallowAllOfMerge({ allOf: [{ contains: { type: "string" } }] })
    ).toEqual({ contains: { type: "string" } });

    expect(
      shallowAllOfMerge({
        base: true,
        allOf: [{ contains: { type: "string" } }],
      } as unknown as JSONSchema7Definition)
    ).toMatchObject({ contains: { type: "string" } });
  });

  it("collapses identical contains to a single contains without allOf", () => {
    const result = shallowAllOfMerge({
      allOf: [
        { contains: { type: "string" } },
        { contains: { type: "string" } },
      ],
    });

    expect(result).toEqual({ contains: { type: "string" } });
    expect(result).not.toHaveProperty("allOf");
  });

  it("collapses allow-any contains to the other side", () => {
    expect(
      mergeSchemaDefinitions(
        { contains: true },
        { contains: { type: "string" } }
      )
    ).toEqual({ contains: { type: "string" } });

    expect(
      mergeSchemaDefinitions({ contains: {} }, { contains: { type: "string" } })
    ).toEqual({ contains: { type: "string" } });

    expect(
      mergeSchemaDefinitions(
        { contains: { type: "string" } },
        { contains: true }
      )
    ).toEqual({ contains: { type: "string" } });
  });

  it("lets contains:false dominate", () => {
    expect(
      mergeSchemaDefinitions(
        { contains: false },
        { contains: { type: "string" } }
      )
    ).toEqual({ contains: false });

    expect(
      mergeSchemaDefinitions(
        { contains: { type: "string" } },
        { contains: false }
      )
    ).toEqual({ contains: false });
  });

  it("merges rest of schema while preserving contains branches", () => {
    const result = shallowAllOfMerge({
      allOf: [
        { contains: { const: 1 }, minItems: 1 },
        { contains: { const: 2 }, maxItems: 5 },
      ],
    });

    expect(result).toEqual({
      minItems: 1,
      maxItems: 5,
      contains: { const: 1 },
      allOf: [{ contains: { const: 2 } }],
    });

    expectEquivalent(
      {
        allOf: [
          { contains: { const: 1 }, minItems: 1 },
          { contains: { const: 2 }, maxItems: 5 },
        ],
      },
      result,
      [[1, 2], [1], [2], [1, 2, 3, 4, 5, 6], [], {}]
    );
  });

  it("accumulates three contains branches exactly", () => {
    const original = {
      allOf: [
        { contains: { const: 1 } },
        { contains: { const: 2 } },
        { contains: { const: 3 } },
      ],
    };
    const result = shallowAllOfMerge(original);

    // Root keeps the first branch, the rest accumulate in `allOf`.
    expect(result).toEqual({
      contains: { const: 1 },
      allOf: [{ contains: { const: 2 } }, { contains: { const: 3 } }],
    });

    expectEquivalent(original, result, [
      [1, 2, 3],
      [1, 2],
      [1],
      [3, 2, 1],
      [],
      {},
    ]);

    const validate = ajv.compile(result);
    expect(validate([1, 2, 3])).toBe(true);
    expect(validate([1, 2])).toBe(false);
  });

  it("composes with if/then/else assigner", () => {
    const result = mergeSchemaDefinitions(
      { if: { type: "string" }, contains: { const: 1 } },
      { if: { type: "number" }, contains: { const: 2 } }
    );

    expect(result).toEqual({
      if: { type: "string" },
      contains: { const: 1 },
      allOf: [{ if: { type: "number" } }, { contains: { const: 2 } }],
    });
  });

  it("merges nested contains via deep merge", () => {
    const result = deepAllOfMerge({
      properties: {
        list: {
          allOf: [{ contains: { const: 1 } }, { contains: { const: 2 } }],
        },
      },
    });

    expect(result).toEqual({
      properties: {
        list: {
          contains: { const: 1 },
          allOf: [{ contains: { const: 2 } }],
        },
      },
    });
  });
});
