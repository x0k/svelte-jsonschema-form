// This file was copied and modified from https://github.com/mokkabonna/json-schema-merge-allof/blob/1cc2aa53a5d33c17d0e9c59b13eed77d86ad91c3/test/specs/properties.spec.js
// MIT © Martin Hansen
// Modifications made by Roman Krasilnikov.

import type { JSONSchema7Definition } from "json-schema";
import { describe, expect, it } from "vitest";
import { Ajv } from "ajv";

import { createMerger } from "./json-schema-merge.js";
import { createMergeAllOf } from "./all-of-merge.js";

const testPatternsMerger = (a: string, b: string) =>
  a === b ? a : `(?=${a})(?=${b})`;

const { mergeSchemas, mergeSchemaDefinitions } = createMerger({
  mergePatterns: testPatternsMerger,
});

const mergeAllOf = createMergeAllOf(mergeSchemas);

function testMerger(
  a: JSONSchema7Definition,
  b: JSONSchema7Definition,
  expected: JSONSchema7Definition
) {
  a;
  const result = mergeSchemaDefinitions(a, b);
  expect(result).toEqual(expected);
  expect(mergeAllOf({ allOf: [a, b] })).toEqual(expected);
  return result;
}

const ajv = new Ajv({
  allowMatchingProperties: true,
});

function validateInputOutput(
  schema: JSONSchema7Definition,
  transformedSchema: JSONSchema7Definition,
  obj: any
) {
  const validOriginal = ajv.validate(schema, obj);
  const validNew = ajv.validate(transformedSchema, obj);
  expect(validOriginal).toBe(validNew);
}

describe("properties", () => {
  describe("when property name has same as a reserved word", () => {
    it("does not treat it as a reserved word", () => {
      testMerger(
        {
          properties: {
            properties: {
              type: "string",
              minLength: 5,
            },
          },
        },
        {
          properties: {
            properties: {
              type: "string",
              minLength: 7,
            },
          },
        },
        {
          properties: {
            properties: {
              type: "string",
              minLength: 7,
            },
          },
        }
      );
    });
  });

  describe("additionalProperties", () => {
    it("allows no extra properties if additionalProperties is false", () => {
      testMerger(
        {
          additionalProperties: true,
        },
        {
          additionalProperties: false,
        },
        {
          additionalProperties: false,
        }
      );
    });

    it("allows only intersecting properties", () => {
      testMerger(
        {
          properties: {
            foo: true,
          },
          additionalProperties: true,
        },
        {
          properties: {
            bar: true,
          },
          additionalProperties: false,
        },
        {
          properties: {
            bar: true,
          },
          additionalProperties: false,
        }
      );
    });

    it("allows intersecting patternproperties", () => {
      testMerger(
        {
          properties: {
            foo: true,
            foo123: true,
          },
          additionalProperties: true,
        },
        {
          properties: {
            bar: true,
          },
          patternProperties: {
            ".+\\d+$": true,
          },
          additionalProperties: false,
        },
        {
          properties: {
            bar: true,
            foo123: true,
          },
          patternProperties: {
            ".+\\d+$": true,
          },
          additionalProperties: false,
        }
      );
    });

    it("disallows all except matching patternProperties if both false", () => {
      testMerger(
        {
          properties: {
            foo: true,
            foo123: true,
          },
          additionalProperties: false,
        },
        {
          properties: {
            bar: true,
          },
          patternProperties: {
            ".+\\d+$": true,
          },
          additionalProperties: false,
        },
        {
          properties: {
            foo123: true,
          },
          additionalProperties: false,
        }
      );
    });

    it("disallows all except matching patternProperties if both false", () => {
      testMerger(
        {
          properties: {
            foo: true,
            foo123: true,
          },
          patternProperties: {
            ".+\\d+$": {
              type: "string",
            },
          },
          additionalProperties: false,
        },
        {
          properties: {
            bar: true,
            bar123: true,
          },
          patternProperties: {
            ".+\\d+$": true,
          },
          additionalProperties: false,
        },
        {
          properties: {
            bar123: {
              type: "string",
            },
            foo123: {
              type: "string",
            },
          },
          patternProperties: {
            ".+\\d+$": {
              type: "string",
            },
          },
          additionalProperties: false,
        }
      );
    });

    it("disallows all except matching patternProperties if both false", () => {
      const lPattern = "^bar";
      const rPattern = ".+\\d+$";
      const lSchema = {
        type: "object",
        properties: {
          foo: true,
          foo123: true,
        },
        patternProperties: {
          [lPattern]: true,
        },
        additionalProperties: false,
      } as const satisfies JSONSchema7Definition;
      const rSchema = {
        type: "object",
        properties: {
          bar: true,
          bar123: true,
        },
        patternProperties: {
          [rPattern]: true,
        },
        additionalProperties: false,
      } as const satisfies JSONSchema7Definition;
      const result = testMerger(
        structuredClone(lSchema),
        structuredClone(rSchema),
        {
          type: "object",
          properties: {
            bar: true,
            foo123: true,
            bar123: true,
          },
          patternProperties: {
            [testPatternsMerger(lPattern, rPattern)]: true,
          },
          additionalProperties: false,
        }
      );
      [
        {
          foo123: "testfdsdfsfd",
        },
        {
          bar123: "testfdsdfsfd",
        },
        {
          foo123: "testfdsdfsfd",
        },
        {
          bar: "fdsaf",
        },
        {
          abc123: "fdsaf",
        },
        {
          bar123: "fdsaf",
        },
        {
          barabc: "fdsaf",
        },
        {
          // additionalProp
          foo234: "testffdsafdsads",
        },
      ].forEach((val) => {
        validateInputOutput({ allOf: [lSchema, rSchema] }, result, val);
      });
    });

    it("disallows all except matching patternProperties if both true", () => {
      const lSchema = {
        type: "object",
        properties: {
          foo: true,
          foo123: true,
        },
        patternProperties: {
          "^bar": true,
        },
      } as const satisfies JSONSchema7Definition;
      const rSchema = {
        type: "object",
        properties: {
          bar: true,
          bar123: true,
        },
        patternProperties: {
          ".+\\d+$": true,
        },
      } as const satisfies JSONSchema7Definition;

      const result = testMerger(
        structuredClone(lSchema),
        structuredClone(rSchema),
        {
          type: "object",
          properties: {
            foo: true,
            bar: true,
            foo123: true,
            bar123: true,
          },
          patternProperties: {
            "^bar": true,
            ".+\\d+$": true,
          },
        }
      );
      [
        {
          foo123: "testfdsdfsfd",
        },
        {
          bar123: "testfdsdfsfd",
        },
        {
          foo123: "testfdsdfsfd",
        },
        {
          foo: "fdsaf",
        },
        {
          bar: "fdsaf",
        },
        {
          abc123: "fdsaf",
        },
        {
          bar123: "fdsaf",
        },
        {
          barabc: "fdsaf",
        },
        {
          foo234: "testffdsafdsads",
        },
      ].forEach(function (val) {
        validateInputOutput({ allOf: [lSchema, rSchema] }, result, val);
      });
    });

    it("disallows all except matching patternProperties if one false", () => {
      const lSchema = {
        type: "object",
        properties: {
          foo: true,
          foo123: true,
        },
      } as const satisfies JSONSchema7Definition;
      const rSchema = {
        type: "object",
        properties: {
          bar: true,
          bar123: true,
        },
        patternProperties: {
          ".+\\d+$": true,
        },
        additionalProperties: false,
      } as const satisfies JSONSchema7Definition;

      const result = testMerger(
        structuredClone(lSchema),
        structuredClone(rSchema),
        {
          type: "object",
          properties: {
            bar: true,
            foo123: true,
            bar123: true,
          },
          patternProperties: {
            ".+\\d+$": true,
          },
          additionalProperties: false,
        }
      );
      [
        {
          foo123: "testfdsdfsfd",
        },
        {
          bar123: "testfdsdfsfd",
        },
        {
          foo123: "testfdsdfsfd",
        },
        {
          foo: "fdsaf",
        },
        {
          bar: "fdsaf",
        },
        {
          abc123: "fdsaf",
        },
        {
          bar123: "fdsaf",
        },
        {
          barabc: "fdsaf",
        },
        {
          foo234: "testffdsafdsads",
        },
      ].forEach(function (val) {
        validateInputOutput({ allOf: [lSchema, rSchema] }, result, val);
      });
    });

    it("disallows all if no patternProperties and if both false", () => {
      testMerger(
        {
          properties: {
            foo: true,
            foo123: true,
          },
          additionalProperties: false,
        },
        {
          properties: {
            bar: true,
          },
          additionalProperties: false,
        },
        {
          additionalProperties: false,
        }
      );
    });

    it("applies additionalProperties to other schemas properties if they have any", () => {
      const result = mergeAllOf({
        properties: {
          common: true,
          root: true,
        },
        additionalProperties: false,
        allOf: [
          {
            properties: {
              common: {
                type: "string",
              },
              allof1: true,
            },
            additionalProperties: {
              type: ["string", "null"],
              maxLength: 10,
            },
          },
          {
            properties: {
              common: {
                minLength: 1,
              },
              allof2: true,
            },
            additionalProperties: {
              type: ["string", "integer", "null"],
              maxLength: 8,
            },
          },
          {
            properties: {
              common: {
                minLength: 6,
              },
              allof3: true,
            },
          },
        ],
      });

      expect(result).toEqual({
        properties: {
          common: {
            type: "string",
            minLength: 6,
          },
          root: {
            type: ["string", "null"],
            maxLength: 8,
          },
        },
        additionalProperties: false,
      });
    });

    it("considers patternProperties before merging additionalProperties to other schemas properties if they have any", () => {
      const result = mergeAllOf({
        properties: {
          common: true,
          root: true,
        },
        patternProperties: {
          ".+\\d{2,}$": {
            minLength: 7,
          },
        },
        additionalProperties: false,
        allOf: [
          {
            properties: {
              common: {
                type: "string",
              },
              allof1: true,
            },
            additionalProperties: {
              type: ["string", "null", "integer"],
              maxLength: 10,
            },
          },
          {
            properties: {
              common: {
                minLength: 1,
              },
              allof2: true,
              allowed123: {
                type: "string",
              },
            },
            patternProperties: {
              ".+\\d{2,}$": {
                minLength: 9,
              },
            },
            additionalProperties: {
              type: ["string", "integer", "null"],
              maxLength: 8,
            },
          },
          {
            properties: {
              common: {
                minLength: 6,
              },
              allof3: true,
              allowed456: {
                type: "integer",
              },
            },
          },
        ],
      });

      expect(result).toEqual({
        properties: {
          common: {
            type: "string",
            minLength: 6,
          },
          root: {
            type: ["string", "null", "integer"],
            maxLength: 8,
          },
          allowed123: {
            type: "string",
            minLength: 9,
            maxLength: 10,
          },
          allowed456: {
            type: "integer",
            minLength: 9,
            maxLength: 10,
          },
        },
        patternProperties: {
          ".+\\d{2,}$": {
            type: ["string", "null", "integer"],
            minLength: 9,
            maxLength: 10,
          },
        },
        additionalProperties: false,
      });
    });

    it("combines additionalProperties when schemas", () => {
      const result = mergeAllOf({
        additionalProperties: true,
        allOf: [
          {
            additionalProperties: {
              type: ["string", "null"],
              maxLength: 10,
            },
          },
          {
            additionalProperties: {
              type: ["string", "integer", "null"],
              maxLength: 8,
            },
          },
        ],
      });

      expect(result).toEqual({
        additionalProperties: {
          type: ["string", "null"],
          maxLength: 8,
        },
      });
    });
  });
});
