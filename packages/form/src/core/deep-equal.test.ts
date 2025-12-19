import { describe, expect, it } from "vitest";

import type { Schema } from "./schema.js";
import { isOrderedSchemaDeepEqual, isSchemaDeepEqual } from "./deep-equal.js";

describe("isSchemaDeepEqual", () => {
  it.each([[isSchemaDeepEqual], [isOrderedSchemaDeepEqual]])(
    "should compare correctly simple schema",
    (compare) => {
      const schema: Schema = {
        type: "object",
        properties: {
          foo: {
            type: "string",
          },
        },
      };
      expect(compare(schema, structuredClone(schema))).toBe(true);
    }
  );
  it.each([
    [isSchemaDeepEqual, true],
    [isOrderedSchemaDeepEqual, false],
  ])(
    "should compare correctly simple schemas with different order in records",
    (compare, expected) => {
      const schema1: Schema = {
        type: "object",
        properties: {
          foo: {
            type: "string",
          },
          bar: {
            type: "number",
          },
        },
      };
      const schema2: Schema = {
        type: "object",
        properties: {
          bar: {
            type: "number",
          },
          foo: {
            type: "string",
          },
        },
      };
      expect(compare(schema1, schema2)).toBe(expected);
    }
  );
});
