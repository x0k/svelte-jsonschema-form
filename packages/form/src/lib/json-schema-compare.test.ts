import { describe, it, expect } from "vitest";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import legacyIsEqual from "json-schema-compare";
import type { Brand } from "@/lib/types.js";

import { isEqual } from "./json-schema-compare.js";

type Match = Brand<"Match", boolean>;

const DOES_NOT_MATCH = false as Match;

function compare(
  a: JSONSchema7Definition,
  b: JSONSchema7Definition,
  expected: boolean,
  match: Match = true as Match
) {
  expect(isEqual(a, b)).toBe(expected);
  expect(legacyIsEqual(a, b)).toBe(match ? expected : !expected)
}

describe("comparison", () => {
  describe("validation only", () => {
    it("checks the readme example", () => {
      compare(
        {
          title: "title 1",
          type: ["object"],
          uniqueItems: false,
          dependencies: {
            name: ["age", "lastName"],
          },
          required: ["name", "age", "name"],
        },
        {
          title: "title 2",
          type: "object",
          required: ["age", "name"],
          dependencies: {
            name: ["lastName", "age"],
          },
          properties: {
            name: {
              minLength: 0,
            },
          },
        },
        false
      );
    });

    // it("compares false and undefined", () => {
    //   expect(isEqual(undefined, false)).toBe(false);
    // });

    it("compares required unsorted", () => {
      compare(
        {
          required: ["test", "rest"],
        },
        {
          required: ["rest", "test", "rest"],
        },
        true
      );
    });

    it("compares equal required empty array and undefined", () => {
      compare(
        {
          required: [],
        },
        {},
        true
      );

      compare(
        {
          required: ["fds"],
        },
        {},
        false
      );
    });

    it("compares equal properties empty object and undefined", () => {
      compare(
        {
          properties: {},
        },
        {},
        true
      );
    });

    it("compares properties", () => {
      compare(
        {
          properties: {
            foo: {
              type: "string",
            },
          },
        },
        {
          properties: {
            foo: {
              type: "string",
            },
          },
        },
        true
      );
    });

    it("compares equal patternProperties empty object and undefined", () => {
      compare(
        {
          patternProperties: {},
        },
        {},
        true
      );
    });

    it("compares equal dependencies empty object and undefined", () => {
      compare(
        {
          dependencies: {},
        },
        {},
        true
      );
    });

    it("compares type unsorted", () => {
      compare(
        {
          type: ["string", "array"],
        },
        {
          type: ["array", "string", "array"],
        },
        true
      );

      compare({}, { type: [] }, false);

      compare({ type: "string" }, { type: ["string"] }, true);
    });

    it("compares equal an empty schema, true and undefined", () => {
      compare({}, true, true);
      // expect(isEqual({}, undefined)).toBe(true);
      compare(false, false, true);
      compare(true, true, true);
    });

    it("ignores any in ignore list", () => {
      compare(
        {
          title: "title",
        },
        {
          title: "foobar",
        },
        false
      );
    });

    it("diffs this", () => {
      compare(
        {
          type: ["string"],
          minLength: 5,
        },
        {
          type: ["string"],
        },
        false
      );
    });

    it("sorts anyOf before comparing", () => {
      compare(
        {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          anyOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
          ],
        },
        true
      );

      compare(
        {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          anyOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
            {
              type: ["string"],
              minLength: 5,
              // @ts-expect-error
              fdsafads: "34534",
            },
          ],
        },
        false
      );

      compare(
        {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          anyOf: [
            {
              type: "integer",
            },
            {
              type: "array",
            },
          ],
        },
        false
      );

      compare(
        {
          anyOf: [
            {
              type: "string",
            },
            {
              type: ["string"],
            },
            {
              type: "integer",
            },
          ],
        },
        {
          anyOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
          ],
        },
        true
      );
    });

    it("sorts allOf before comparing", () => {
      compare(
        {
          allOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          allOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
          ],
        },
        true
      );

      compare(
        {
          allOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          allOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
            {
              type: ["string"],
              minLength: 5,
              //@ts-expect-error
              fdsafads: "34534",
            },
          ],
        },
        false
      );

      compare(
        {
          allOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          allOf: [
            {
              type: "integer",
            },
            {
              type: "array",
            },
          ],
        },
        false
      );

      compare(
        {
          allOf: [
            {
              type: "string",
            },
            {
              type: ["string"],
            },
            {
              type: "integer",
            },
          ],
        },
        {
          allOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
          ],
        },
        true
      );
    });

    it("sorts oneOf before comparing", () => {
      compare(
        {
          oneOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          oneOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
          ],
        },
        true
      );

      compare(
        {
          oneOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          oneOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
            {
              type: ["string"],
              minLength: 5,
              //@ts-expect-error
              fdsafads: "34534",
            },
          ],
        },
        false
      );

      compare(
        {
          oneOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
        {
          oneOf: [
            {
              type: "integer",
            },
            {
              type: "array",
            },
          ],
        },
        false
      );

      compare(
        {
          oneOf: [
            {
              type: "string",
            },
            {
              type: ["string"],
            },
            {
              type: "integer",
            },
          ],
        },
        {
          oneOf: [
            {
              type: "integer",
            },
            {
              type: "string",
            },
          ],
        },
        true
      );
    });

    it("compares enum unsorted", () => {
      compare(
        {
          enum: ["abc", "123"],
        },
        {
          enum: ["123", "abc", "abc"],
        },
        true
      );
    });

    it("compares dependencies value if array unsorted", () => {
      compare(
        {
          dependencies: {
            foo: ["abc", "123"],
          },
        },
        {
          dependencies: {
            foo: ["123", "abc", "abc"],
          },
        },
        true
      );
    });

    it("compares items SORTED", () => {
      compare(
        {
          items: [true, false],
        },
        {
          items: [true, true],
        },
        false
      );

      compare(
        {
          items: [{}, false],
        },
        {
          items: [true, false],
        },
        true
      );
    });

    it("compares equal uniqueItems false and undefined", () => {
      compare(
        {
          uniqueItems: false,
        },
        {},
        true
      );
    });

    it("compares equal minLength undefined and 0", () => {
      compare(
        {
          minLength: 0,
        },
        {},
        true
      );
    });

    it("compares equal minItems undefined and 0", () => {
      compare(
        {
          minItems: 0,
        },
        {},
        true
      );
    });

    it("compares equal minProperties undefined and 0", () => {
      compare(
        {
          minProperties: 0,
        },
        {},
        true
      );
    });
  });

  describe("edge cases", () => {
    it("handles deeply nested objects", () => {
      const deepSchema1: JSONSchema7 = {
        properties: {
          user: {
            type: "object",
            properties: {
              profile: {
                type: "object",
                properties: {
                  settings: {
                    type: "object",
                    properties: {
                      theme: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const deepSchema2: JSONSchema7 = {
        properties: {
          user: {
            type: "object",
            properties: {
              profile: {
                type: "object",
                properties: {
                  settings: {
                    type: "object",
                    properties: {
                      theme: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      };
      compare(deepSchema1, deepSchema2, true);

      const deepSchema3: JSONSchema7 = {
        properties: {
          user: {
            type: "object",
            properties: {
              profile: {
                type: "object",
                properties: {
                  settings: {
                    type: "object",
                    properties: {
                      theme: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
      };
      compare(deepSchema1, deepSchema3, false);
    });

    it("handles circular references in anyOf/allOf/oneOf", () => {
      compare(
        {
          anyOf: [{ type: "string" }, { type: "number" }, { type: "string" }],
        },
        {
          anyOf: [{ type: "number" }, { type: "string" }],
        },
        true
      );
    });

    it("handles complex enum combinations", () => {
      compare(
        {
          enum: [1, 2, 3, null, "", 0, false],
        },
        {
          enum: [false, 0, "", null, 3, 2, 1],
        },
        true,
        DOES_NOT_MATCH
      );

      compare(
        {
          enum: [{ a: 1 }, { b: 2 }],
        },
        {
          enum: [{ b: 2 }, { a: 1 }],
        },
        true,
        DOES_NOT_MATCH
      );
    });

    it("handles mixed type arrays", () => {
      compare(
        {
          type: ["string", "number", "boolean", "null"],
        },
        {
          type: ["null", "boolean", "number", "string"],
        },
        true
      );

      compare(
        {
          type: ["array", "object"],
        },
        {
          type: ["object", "array", "array"],
        },
        true
      );
    });

    it("handles complex dependencies", () => {
      compare(
        {
          dependencies: {
            name: ["firstName", "lastName"],
            address: {
              type: "object",
              properties: {
                street: { type: "string" },
              },
            },
          },
        },
        {
          dependencies: {
            name: ["lastName", "firstName"],
            address: {
              type: "object",
              properties: {
                street: { type: "string" },
              },
            },
          },
        },
        true
      );

      compare(
        {
          dependencies: {
            name: ["firstName", "lastName"],
          },
        },
        {
          dependencies: {
            name: ["firstName", "middleName"],
          },
        },
        false,
        DOES_NOT_MATCH
      );
    });

    it("handles additionalProperties edge cases", () => {
      compare(
        {
          additionalProperties: true,
        },
        {
          additionalProperties: {},
        },
        true
      );

      compare(
        {
          additionalProperties: false,
        },
        {
          additionalProperties: false,
        },
        true
      );

      compare(
        {
          additionalProperties: { type: "string" },
        },
        {
          additionalProperties: { type: "string" },
        },
        true
      );

      compare(
        {
          additionalProperties: { type: "string" },
        },
        {
          additionalProperties: { type: "number" },
        },
        false
      );
    });

    it("handles additionalItems edge cases", () => {
      compare(
        {
          additionalItems: true,
        },
        {
          additionalItems: {},
        },
        true
      );

      compare(
        {
          additionalItems: false,
        },
        {
          additionalItems: false,
        },
        true
      );

      compare(
        {
          additionalItems: { type: "string" },
        },
        {
          additionalItems: { type: "string" },
        },
        true
      );
    });

    it("handles patternProperties complex cases", () => {
      compare(
        {
          patternProperties: {
            "^S_": { type: "string" },
            "^I_": { type: "integer" },
          },
        },
        {
          patternProperties: {
            "^I_": { type: "integer" },
            "^S_": { type: "string" },
          },
        },
        true
      );

      compare(
        {
          patternProperties: {
            "^S_": { type: "string" },
          },
        },
        {
          patternProperties: {
            "^S_": { type: "number" },
          },
        },
        false
      );
    });

    it("handles format property", () => {
      compare(
        {
          type: "string",
          format: "email",
        },
        {
          type: "string",
          format: "email",
        },
        true
      );

      compare(
        {
          type: "string",
          format: "email",
        },
        {
          type: "string",
          format: "uri",
        },
        false
      );

      compare(
        {
          type: "string",
        },
        {
          type: "string",
          format: undefined,
        },
        true
      );
    });

    it("handles numeric constraints", () => {
      compare(
        {
          type: "number",
          minimum: 0,
          maximum: 100,
          multipleOf: 5,
        },
        {
          type: "number",
          minimum: 0,
          maximum: 100,
          multipleOf: 5,
        },
        true
      );

      compare(
        {
          type: "number",
          minimum: 0,
          exclusiveMinimum: 1,
        },
        {
          type: "number",
          minimum: 0,
          exclusiveMinimum: 1,
        },
        true
      );

      compare(
        {
          type: "number",
          minimum: 0,
        },
        {
          type: "number",
          minimum: 1,
        },
        false
      );
    });

    it("handles string constraints", () => {
      compare(
        {
          type: "string",
          minLength: 1,
          maxLength: 100,
          pattern: "^[a-zA-Z]+$",
        },
        {
          type: "string",
          minLength: 1,
          maxLength: 100,
          pattern: "^[a-zA-Z]+$",
        },
        true
      );

      compare(
        {
          type: "string",
          pattern: "^[a-zA-Z]+$",
        },
        {
          type: "string",
          pattern: "^[0-9]+$",
        },
        false
      );
    });

    it("handles array constraints", () => {
      compare(
        {
          type: "array",
          minItems: 1,
          maxItems: 10,
          uniqueItems: true,
        },
        {
          type: "array",
          minItems: 1,
          maxItems: 10,
          uniqueItems: true,
        },
        true
      );

      compare(
        {
          type: "array",
          items: [{ type: "string" }, { type: "number" }],
        },
        {
          type: "array",
          items: [{ type: "string" }, { type: "number" }],
        },
        true
      );

      compare(
        {
          type: "array",
          items: { type: "string" },
        },
        {
          type: "array",
          items: { type: "string" },
        },
        true
      );
    });

    it("handles object constraints", () => {
      compare(
        {
          type: "object",
          minProperties: 1,
          maxProperties: 10,
        },
        {
          type: "object",
          minProperties: 1,
          maxProperties: 10,
        },
        true
      );

      compare(
        {
          type: "object",
          minProperties: 1,
        },
        {
          type: "object",
          minProperties: 2,
        },
        false
      );
    });

    it("handles $ref and $id properties", () => {
      compare(
        {
          $ref: "#/definitions/User",
        },
        {
          $ref: "#/definitions/User",
        },
        true
      );

      compare(
        {
          $id: "http://example.com/schema.json",
        },
        {
          $id: "http://example.com/schema.json",
        },
        true
      );

      compare(
        {
          $ref: "#/definitions/User",
        },
        {
          $ref: "#/definitions/Person",
        },
        false
      );
    });

    it("handles const property", () => {
      compare(
        {
          const: "fixed-value",
        },
        {
          const: "fixed-value",
        },
        true
      );

      compare(
        {
          const: { a: 1, b: 2 },
        },
        {
          const: { a: 1, b: 2 },
        },
        true
      );

      compare(
        {
          const: "value1",
        },
        {
          const: "value2",
        },
        false
      );
    });

    it("handles if/then/else properties", () => {
      compare(
        {
          if: { properties: { foo: { const: "bar" } } },
          then: { required: ["baz"] },
          else: { required: ["qux"] },
        },
        {
          if: { properties: { foo: { const: "bar" } } },
          then: { required: ["baz"] },
          else: { required: ["qux"] },
        },
        true
      );

      compare(
        {
          if: { properties: { foo: { const: "bar" } } },
          then: { required: ["baz"] },
        },
        {
          if: { properties: { foo: { const: "bar" } } },
          then: { required: ["different"] },
        },
        false
      );
    });

    it("handles very large schemas", () => {
      const largeSchema1: any = {
        type: "object",
        properties: {},
      };
      const largeSchema2: any = {
        type: "object",
        properties: {},
      };

      // Generate 100 properties
      for (let i = 0; i < 100; i++) {
        largeSchema1.properties[`prop${i}`] = { type: "string", minLength: i };
        largeSchema2.properties[`prop${i}`] = { type: "string", minLength: i };
      }

      compare(largeSchema1, largeSchema2, true);

      // Change one property
      largeSchema2.properties.prop50.minLength = 999;
      compare(largeSchema1, largeSchema2, false);
    });

    it("handles empty vs undefined vs false edge cases", () => {
      compare({}, {}, true);
      compare(true, {}, true);
      compare({}, true, true);
      compare(false, false, true);
      compare(true, false, false);
      // expect(isEqual(undefined, undefined)).toBe(true);
    });
  });
});
