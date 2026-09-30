import { describe, it, expect, beforeEach } from "vitest";

import type { Merger } from "./merger.js";
import { getSchemaDefinitionByPath, type RPath } from "./path.js";
import type { Schema, SchemaValue } from "./schema.js";
import { createMerger } from "./test-merger.js";
import { createValidator } from "./test-validator.js";
import type { Validator } from "./validator.js";

describe("getSchemaDefinitionByPath", () => {
  let testValidator: Validator;
  let defaultMerger: Merger;

  beforeEach(() => {
    testValidator = createValidator();
    defaultMerger = createMerger();
  });

  const get = (
    schema: Schema,
    path: RPath,
    value: SchemaValue | undefined = undefined
  ) =>
    getSchemaDefinitionByPath(
      testValidator,
      defaultMerger,
      schema,
      schema,
      path,
      value
    );

  it("should return the property definition for an object schema", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
      },
    };
    const result = get(schema, ["foo"]);
    expect(result).toEqual({ type: "string" });
  });

  it("should return the item definition for an array schema", () => {
    const schema: Schema = {
      type: "array",
      items: { type: "number" },
    };
    const result = get(schema, [0]);
    expect(result).toEqual({ type: "number" });
  });

  it("should return undefined when the path does not exist", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
      },
    };
    const result = get(schema, ["bar"]);
    expect(result).toBeUndefined();
  });

  it("should resolve a nested property path", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        nested: {
          type: "object",
          properties: {
            value: { type: "boolean" },
          },
        },
      },
    };
    const result = get(schema, ["nested", "value"]);
    expect(result).toEqual({ type: "boolean" });
  });

  it("should resolve patternProperties", () => {
    const schema: Schema = {
      type: "object",
      patternProperties: {
        "^foo$": {
          type: "string",
        },
        "^bar$": {
          type: "number",
        },
      },
    };
    const result = get(schema, ["foo"]);
    expect(result).toEqual({ type: "string" });
  });

  it("should handle alternative keywords (anyOf) and return the first valid schema", () => {
    const schema: Schema = {
      type: "object",
      anyOf: [
        {
          type: "object",
          properties: {
            alt: { type: "string" },
          },
        },
        {
          type: "object",
          properties: {
            alt: { type: "number" },
          },
        },
      ],
    };
    const result = get(schema, ["alt"]);
    expect(result).toEqual({ type: "string" });
  });

  it("should handle dependencies keyword", () => {
    const schema: Schema = {
      title: "Person",
      type: "object",
      properties: {
        "Do you have any pets?": {
          type: "string",
          enum: ["No", "Yes: One", "Yes: More than one"],
          default: "No",
        },
      },
      required: ["Do you have any pets?"],
      dependencies: {
        "Do you have any pets?": {
          oneOf: [
            {
              properties: {
                "Do you have any pets?": {
                  enum: ["No"],
                },
              },
            },
            {
              properties: {
                "Do you have any pets?": {
                  enum: ["Yes: One"],
                },
                "How old is your pet?": {
                  type: "number",
                },
              },
              required: ["How old is your pet?"],
            },
            {
              properties: {
                "Do you have any pets?": {
                  enum: ["Yes: More than one"],
                },
                "Do you want to get rid of any?": {
                  type: "boolean",
                },
              },
              required: ["Do you want to get rid of any?"],
            },
          ],
        },
      },
    };
    const result = get(schema, ["How old is your pet?"]);
    expect(result).toEqual({
      type: "number",
    });
  });

  it("should handle if,then,else keywords", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        animal: {
          enum: ["Cat", "Fish"],
        },
      },
      allOf: [
        {
          if: {
            properties: {
              animal: {
                const: "Cat",
              },
            },
          },
          then: {
            properties: {
              food: {
                type: "string",
                enum: ["meat", "grass", "fish"],
              },
            },
            required: ["food"],
          },
        },
        {
          if: {
            properties: {
              animal: {
                const: "Fish",
              },
            },
          },
          then: {
            properties: {
              food: {
                type: "string",
                enum: ["insect", "worms"],
              },
              water: {
                type: "string",
                enum: ["lake", "sea"],
              },
            },
            required: ["food", "water"],
          },
        },
        {
          required: ["animal"],
        },
      ],
    };
    defaultMerger = createMerger({
      allOfMerges: [
        {
          input: {
            type: "object",
            properties: { animal: { enum: ["Cat", "Fish"] } },
            allOf: [
              {
                if: { properties: { animal: { const: "Cat" } } },
                then: {
                  properties: {
                    food: { type: "string", enum: ["meat", "grass", "fish"] },
                  },
                  required: ["food"],
                },
              },
              {
                if: { properties: { animal: { const: "Fish" } } },
                then: {
                  properties: {
                    food: { type: "string", enum: ["insect", "worms"] },
                    water: { type: "string", enum: ["lake", "sea"] },
                  },
                  required: ["food", "water"],
                },
              },
              { required: ["animal"] },
            ],
          },
          result: {
            type: "object",
            properties: { animal: { enum: ["Cat", "Fish"] } },
            if: { properties: { animal: { const: "Cat" } } },
            then: {
              properties: {
                food: { type: "string", enum: ["meat", "grass", "fish"] },
              },
              required: ["food"],
            },
            allOf: [
              {
                if: { properties: { animal: { const: "Fish" } } },
                then: {
                  properties: {
                    food: { type: "string", enum: ["insect", "worms"] },
                    water: { type: "string", enum: ["lake", "sea"] },
                  },
                  required: ["food", "water"],
                },
              },
            ],
            required: ["animal"],
          },
        },
      ],
    });
    const result = get(schema, ["water"]);
    expect(result).toEqual({
      type: "string",
      enum: ["lake", "sea"],
    });
  });

  describe("a schema declaring one group in allOf and the other in oneOf", () => {
    const schema: Schema = {
      allOf: [{ properties: { a: { type: "string", title: "FROM-ALLOF" } } }],
      oneOf: [{ properties: { b: { type: "string", title: "FROM-ONEOF" } } }],
    };

    // mergeAllOf() is attempted for any schema carrying `allOf`, so the test
    // merger needs a case; merging is not what this group of tests exercises
    beforeEach(() => {
      defaultMerger = createMerger({
        allOfMerges: [{ input: schema, result: schema }],
      });
    });

    // A path may descend into either group. Reading only one and stopping once it
    // yields nothing meant a property declared solely in the other was not found,
    // so its schema, its defaults and its id were all missing.
    it("finds a property declared only in the allOf branch", () => {
      expect(get(schema, ["a"])).toEqual({
        type: "string",
        title: "FROM-ALLOF",
      });
    });
    it("finds a property declared only in the oneOf branch", () => {
      expect(get(schema, ["b"])).toEqual({
        type: "string",
        title: "FROM-ONEOF",
      });
    });

    it("prefers the allOf member when both groups declare the property", () => {
      const both: Schema = {
        allOf: [{ properties: { x: { type: "string", title: "FROM-ALLOF" } } }],
        anyOf: [{ properties: { x: { type: "string", title: "FROM-ANYOF" } } }],
      };
      defaultMerger = createMerger({
        allOfMerges: [{ input: both, result: both }],
      });
      expect(get(both, ["x"])).toEqual({ type: "string", title: "FROM-ALLOF" });
    });
  });
});
