import { describe, expect, it } from "vitest";

import {
  additionalPropertiesKeyword,
  getAdditionalPropertySchema,
  getMatchingPatternProperties,
} from "./additional-properties.js";
import { ALL_OF_KEY, type Schema } from "./schema.js";

describe("getMatchingPatternProperties()", () => {
  it("returns only the patterns matching the key", () => {
    const patterns: NonNullable<Schema["patternProperties"]> = {
      "^foo": { type: "string" },
      "^bar": { type: "number" },
    };
    expect(getMatchingPatternProperties(patterns, "foobar")).toEqual([
      { type: "string" },
    ]);
  });

  it("compiles unicode property escapes the way a validator does", () => {
    const patterns = { "\\p{Lu}+": true };
    // `ABC` matches only when `\p{Lu}` is read as a unicode property escape;
    // without the `u` flag the pattern would be the literal `p{Lu}+`.
    expect(getMatchingPatternProperties(patterns, "ABC")).toEqual([true]);
    expect(getMatchingPatternProperties(patterns, "abc")).toEqual([]);
  });

  it("keeps a pattern the unicode flag rejects usable", () => {
    const patterns = { "\\-": true };
    expect(getMatchingPatternProperties(patterns, "-")).toEqual([true]);
  });
});

describe("additionalPropertiesKeyword()", () => {
  it("reads additionalProperties first", () => {
    expect(
      additionalPropertiesKeyword({
        additionalProperties: { type: "number" },
        unevaluatedProperties: false,
      })
    ).toEqual({ type: "number" });
  });

  it("falls through to unevaluatedProperties only when additionalProperties is absent", () => {
    expect(
      additionalPropertiesKeyword({
        additionalProperties: undefined,
        unevaluatedProperties: false,
      })
    ).toBe(false);
    expect(
      additionalPropertiesKeyword({
        additionalProperties: true,
        unevaluatedProperties: false,
      })
    ).toBe(true);
  });
});

describe("getAdditionalPropertySchema()", () => {
  it("describes a pattern-matched key by all matching patterns", () => {
    const schema = {
      patternProperties: { "^foo": { type: "string" }, "^f": { minLength: 2 } },
    } satisfies Schema;
    expect(getAdditionalPropertySchema(schema, "foo")).toEqual({
      [ALL_OF_KEY]: [{ type: "string" }, { minLength: 2 }],
    });
  });

  it("forbids a key a matching pattern forbids", () => {
    const schema = {
      patternProperties: { "^foo": false, "^f": { type: "string" } },
    } satisfies Schema;
    expect(getAdditionalPropertySchema(schema, "foo")).toBe(false);
  });

  it("uses the extra-key keyword for a key no pattern matches", () => {
    const schema = {
      patternProperties: { "^foo": { type: "string" } },
      additionalProperties: false,
      unevaluatedProperties: { type: "number" },
    } satisfies Schema;
    expect(getAdditionalPropertySchema(schema, "bar")).toBe(false);
    expect(
      getAdditionalPropertySchema(
        {
          patternProperties: { "^foo": { type: "string" } },
          unevaluatedProperties: { type: "number" },
        } satisfies Schema,
        "bar"
      )
    ).toEqual({ type: "number" });
  });

  it("allows a key an object leaves undescribed", () => {
    expect(getAdditionalPropertySchema({ properties: {} }, "foo")).toBe(true);
  });
});
