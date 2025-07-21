import { describe, it, expect } from "vitest";
// import isEqual from "json-schema-compare";

import type { Schema } from "../schema.js";

import { isEqual } from "./compare.js";

describe("comparison", () => {
  describe("validation only", () => {
    it("checks the readme example", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(false);
    });

    // it("compares false and undefined", () => {
    //   expect(isEqual(undefined, false)).toBe(false);
    // });

    it("compares required unsorted", () => {
      expect(
        isEqual(
          {
            required: ["test", "rest"],
          },
          {
            required: ["rest", "test", "rest"],
          }
        )
      ).toBe(true);
    });

    it("compares equal required empty array and undefined", () => {
      expect(
        isEqual(
          {
            required: [],
          },
          {}
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            required: ["fds"],
          },
          {}
        )
      ).toBe(false);
    });

    it("compares equal properties empty object and undefined", () => {
      expect(
        isEqual(
          {
            properties: {},
          },
          {}
        )
      ).toBe(true);
    });

    it("compares properties", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);
    });

    it("compares equal patternProperties empty object and undefined", () => {
      expect(
        isEqual(
          {
            patternProperties: {},
          },
          {}
        )
      ).toBe(true);
    });

    it("compares equal dependencies empty object and undefined", () => {
      expect(
        isEqual(
          {
            dependencies: {},
          },
          {}
        )
      ).toBe(true);
    });

    it("compares type unsorted", () => {
      expect(
        isEqual(
          {
            type: ["string", "array"],
          },
          {
            type: ["array", "string", "array"],
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {},
          {
            type: [],
          }
        )
      ).toBe(false);

      expect(
        isEqual(
          {
            type: "string",
          },
          {
            type: ["string"],
          }
        )
      ).toBe(true);
    });

    it("compares equal an empty schema, true and undefined", () => {
      expect(isEqual({}, true)).toBe(true);
      // expect(isEqual({}, undefined)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
      expect(isEqual(true, true)).toBe(true);
    });

    it("ignores any in ignore list", () => {
      expect(
        isEqual(
          {
            title: "title",
          },
          {
            title: "foobar",
          }
        )
      ).toBe(false);
    });

    it("diffs this", () => {
      expect(
        isEqual(
          {
            type: ["string"],
            minLength: 5,
          },
          {
            type: ["string"],
          }
        )
      ).toBe(false);
    });

    it("sorts anyOf before comparing", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
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
          }
        )
      ).toBe(false);

      expect(
        isEqual(
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
          }
        )
      ).toBe(false);

      expect(
        isEqual(
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
          }
        )
      ).toBe(true);
    });

    it("sorts allOf before comparing", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
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
          }
        )
      ).toBe(false);

      expect(
        isEqual(
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
          }
        )
      ).toBe(false);

      expect(
        isEqual(
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
          }
        )
      ).toBe(true);
    });

    it("sorts oneOf before comparing", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
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
          }
        )
      ).toBe(false);

      expect(
        isEqual(
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
          }
        )
      ).toBe(false);

      expect(
        isEqual(
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
          }
        )
      ).toBe(true);
    });

    it("compares enum unsorted", () => {
      expect(
        isEqual(
          {
            enum: ["abc", "123"],
          },
          {
            enum: ["123", "abc", "abc"],
          }
        )
      ).toBe(true);
    });

    it("compares dependencies value if array unsorted", () => {
      expect(
        isEqual(
          {
            dependencies: {
              foo: ["abc", "123"],
            },
          },
          {
            dependencies: {
              foo: ["123", "abc", "abc"],
            },
          }
        )
      ).toBe(true);
    });

    it("compares items SORTED", () => {
      expect(
        isEqual(
          {
            items: [true, false],
          },
          {
            items: [true, true],
          }
        )
      ).toBe(false);

      expect(
        isEqual(
          {
            items: [{}, false],
          },
          {
            items: [true, false],
          }
        )
      ).toBe(true);
    });

    it("compares equal uniqueItems false and undefined", () => {
      expect(
        isEqual(
          {
            uniqueItems: false,
          },
          {}
        )
      ).toBe(true);
    });

    it("compares equal minLength undefined and 0", () => {
      expect(
        isEqual(
          {
            minLength: 0,
          },
          {}
        )
      ).toBe(true);
    });

    it("compares equal minItems undefined and 0", () => {
      expect(
        isEqual(
          {
            minItems: 0,
          },
          {}
        )
      ).toBe(true);
    });

    it("compares equal minProperties undefined and 0", () => {
      expect(
        isEqual(
          {
            minProperties: 0,
          },
          {}
        )
      ).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles deeply nested objects", () => {
      const deepSchema1: Schema = {
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
      const deepSchema2: Schema = {
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
      expect(isEqual(deepSchema1, deepSchema2)).toBe(true);

      const deepSchema3: Schema = {
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
      expect(isEqual(deepSchema1, deepSchema3)).toBe(false);
    });

    it("handles circular references in anyOf/allOf/oneOf", () => {
      expect(
        isEqual(
          {
            anyOf: [{ type: "string" }, { type: "number" }, { type: "string" }],
          },
          {
            anyOf: [{ type: "number" }, { type: "string" }],
          }
        )
      ).toBe(true);
    });

    it("handles complex enum combinations", () => {
      expect(
        isEqual(
          {
            enum: [1, 2, 3, null, "", 0, false],
          },
          {
            enum: [false, 0, "", null, 3, 2, 1],
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            enum: [{ a: 1 }, { b: 2 }],
          },
          {
            enum: [{ b: 2 }, { a: 1 }],
          }
        )
      ).toBe(true);
    });

    it("handles mixed type arrays", () => {
      expect(
        isEqual(
          {
            type: ["string", "number", "boolean", "null"],
          },
          {
            type: ["null", "boolean", "number", "string"],
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: ["array", "object"],
          },
          {
            type: ["object", "array", "array"],
          }
        )
      ).toBe(true);
    });

    it.only("handles complex dependencies", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            dependencies: {
              name: ["firstName", "lastName"],
            },
          },
          {
            dependencies: {
              name: ["firstName", "middleName"],
            },
          }
        )
      ).toBe(false);
    });

    it("handles additionalProperties edge cases", () => {
      expect(
        isEqual(
          {
            additionalProperties: true,
          },
          {
            additionalProperties: {},
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            additionalProperties: false,
          },
          {
            additionalProperties: false,
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            additionalProperties: { type: "string" },
          },
          {
            additionalProperties: { type: "string" },
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            additionalProperties: { type: "string" },
          },
          {
            additionalProperties: { type: "number" },
          }
        )
      ).toBe(false);
    });

    it("handles additionalItems edge cases", () => {
      expect(
        isEqual(
          {
            additionalItems: true,
          },
          {
            additionalItems: {},
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            additionalItems: false,
          },
          {
            additionalItems: false,
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            additionalItems: { type: "string" },
          },
          {
            additionalItems: { type: "string" },
          }
        )
      ).toBe(true);
    });

    it("handles patternProperties complex cases", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            patternProperties: {
              "^S_": { type: "string" },
            },
          },
          {
            patternProperties: {
              "^S_": { type: "number" },
            },
          }
        )
      ).toBe(false);
    });

    it("handles format property", () => {
      expect(
        isEqual(
          {
            type: "string",
            format: "email",
          },
          {
            type: "string",
            format: "email",
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: "string",
            format: "email",
          },
          {
            type: "string",
            format: "uri",
          }
        )
      ).toBe(false);

      expect(
        isEqual(
          {
            type: "string",
          },
          {
            type: "string",
            format: undefined,
          }
        )
      ).toBe(true);
    });

    it("handles numeric constraints", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: "number",
            minimum: 0,
            exclusiveMinimum: 1,
          },
          {
            type: "number",
            minimum: 0,
            exclusiveMinimum: 1,
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: "number",
            minimum: 0,
          },
          {
            type: "number",
            minimum: 1,
          }
        )
      ).toBe(false);
    });

    it("handles string constraints", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: "string",
            pattern: "^[a-zA-Z]+$",
          },
          {
            type: "string",
            pattern: "^[0-9]+$",
          }
        )
      ).toBe(false);
    });

    it("handles array constraints", () => {
      expect(
        isEqual(
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
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: "array",
            items: [{ type: "string" }, { type: "number" }],
          },
          {
            type: "array",
            items: [{ type: "string" }, { type: "number" }],
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: "array",
            items: { type: "string" },
          },
          {
            type: "array",
            items: { type: "string" },
          }
        )
      ).toBe(true);
    });

    it("handles object constraints", () => {
      expect(
        isEqual(
          {
            type: "object",
            minProperties: 1,
            maxProperties: 10,
          },
          {
            type: "object",
            minProperties: 1,
            maxProperties: 10,
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            type: "object",
            minProperties: 1,
          },
          {
            type: "object",
            minProperties: 2,
          }
        )
      ).toBe(false);
    });

    it("handles $ref and $id properties", () => {
      expect(
        isEqual(
          {
            $ref: "#/definitions/User",
          },
          {
            $ref: "#/definitions/User",
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            $id: "http://example.com/schema.json",
          },
          {
            $id: "http://example.com/schema.json",
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            $ref: "#/definitions/User",
          },
          {
            $ref: "#/definitions/Person",
          }
        )
      ).toBe(false);
    });

    it("handles const property", () => {
      expect(
        isEqual(
          {
            const: "fixed-value",
          },
          {
            const: "fixed-value",
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            const: { a: 1, b: 2 },
          },
          {
            const: { a: 1, b: 2 },
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            const: "value1",
          },
          {
            const: "value2",
          }
        )
      ).toBe(false);
    });

    it("handles if/then/else properties", () => {
      expect(
        isEqual(
          {
            if: { properties: { foo: { const: "bar" } } },
            then: { required: ["baz"] },
            else: { required: ["qux"] },
          },
          {
            if: { properties: { foo: { const: "bar" } } },
            then: { required: ["baz"] },
            else: { required: ["qux"] },
          }
        )
      ).toBe(true);

      expect(
        isEqual(
          {
            if: { properties: { foo: { const: "bar" } } },
            then: { required: ["baz"] },
          },
          {
            if: { properties: { foo: { const: "bar" } } },
            then: { required: ["different"] },
          }
        )
      ).toBe(false);
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

      expect(isEqual(largeSchema1, largeSchema2)).toBe(true);

      // Change one property
      largeSchema2.properties.prop50.minLength = 999;
      expect(isEqual(largeSchema1, largeSchema2)).toBe(false);
    });

    it("handles empty vs undefined vs false edge cases", () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual(true, {})).toBe(true);
      expect(isEqual({}, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
      expect(isEqual(true, false)).toBe(false);
      // expect(isEqual(undefined, undefined)).toBe(true);
    });
  });
});
