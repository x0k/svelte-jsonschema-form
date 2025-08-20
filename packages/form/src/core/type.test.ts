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
    expected: "null",
  },
];

describe("typeOfSchema", () => {
  it.each(cases.map((c) => [c.expected, c.schema]))(
    `should correctly guess the type "%s" of a schema %j`,
    (expected, schema) => expect(getSimpleSchemaType(schema)).toBe(expected)
  );
});
