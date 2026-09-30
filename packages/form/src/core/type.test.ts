// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/0d3515b904ca76834b7036d1044cb4b992c21ed3/packages/utils/test/getSchemaType.test.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { expect, describe, it } from "vitest";

import type { Schema } from "./schema.js";
import { getSimpleSchemaType } from "./type.js";

const cases: { schema: Schema; expected: string }[] = [
  {
    schema: { type: "string" },
    expected: "string",
  },
  {
    schema: { type: "number" },
    expected: "number",
  },
  {
    schema: { type: "integer" },
    expected: "integer",
  },
  {
    schema: { type: "object" },
    expected: "object",
  },
  {
    schema: { type: "array" },
    expected: "array",
  },
  {
    schema: { type: "boolean" },
    expected: "boolean",
  },
  {
    schema: { type: "null" },
    expected: "null",
  },
  {
    schema: { const: "foo" },
    expected: "string",
  },
  {
    schema: { const: 1 },
    expected: "number",
  },
  {
    schema: { type: ["string", "null"] },
    expected: "string",
  },
  {
    schema: { type: ["null", "number"] },
    expected: "number",
  },
  {
    schema: { type: ["integer", "null"] },
    expected: "integer",
  },
  {
    schema: { type: ["string", "number"] },
    expected: "string",
  },
  {
    schema: { type: ["number", "string"] },
    expected: "number",
  },
  {
    schema: { properties: {} },
    expected: "object",
  },
  {
    schema: { additionalProperties: {} },
    expected: "object",
  },
  {
    schema: { patternProperties: { "^foo": {} } },
    expected: "object",
  },
  {
    schema: { enum: ["foo"] },
    expected: "string",
  },
  {
    schema: {},
    expected: "unknown",
  },
];

describe("typeOfSchema", () => {
  it.each(cases.map((c) => [c.expected, c.schema]))(
    `should correctly guess the type "%s" of a schema %j`,
    (expected, schema) => expect(getSimpleSchemaType(schema)).toBe(expected)
  );

  describe("empty oneOf/anyOf/allOf lists", () => {
    // An empty list offers no type to take. Reading one used to reach
    // `pickSchemaType()` with an empty array, which throws
    // "Unsupported schema types: empty type array" for every field config.
    it.each([
      ["empty oneOf", { oneOf: [] }],
      ["empty anyOf", { anyOf: [] }],
      ["empty allOf", { allOf: [] }],
      ["both oneOf and anyOf empty", { oneOf: [], anyOf: [] }],
    ])("falls through to unknown for %s", (_name, schema) => {
      expect(getSimpleSchemaType(schema)).toBe("unknown");
    });

    it("ignores an empty list in favour of a populated sibling", () => {
      const consts: Schema = { oneOf: [{ type: "string" }] };
      expect(getSimpleSchemaType({ ...consts, anyOf: [] })).toBe("string");
      expect(
        getSimpleSchemaType({ ...consts, oneOf: [], anyOf: consts.oneOf })
      ).toBe("string");
    });

    it("reads anyOf when both lists are populated", () => {
      expect(
        getSimpleSchemaType({
          oneOf: [{ type: "string" }],
          anyOf: [{ type: "number" }],
        })
      ).toBe("number");
    });

    it("keeps allOf ahead of oneOf/anyOf", () => {
      expect(
        getSimpleSchemaType({
          allOf: [{ type: "number" }],
          oneOf: [{ type: "string" }],
        })
      ).toBe("number");
    });

    it("falls through to allOf when every oneOf/anyOf list is empty", () => {
      expect(
        getSimpleSchemaType({
          allOf: [{ type: "number" }],
          oneOf: [],
          anyOf: [],
        })
      ).toBe("number");
    });
  });
});
