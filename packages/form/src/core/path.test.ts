import { describe, it, expect } from "vitest";

import { getSchemaDefinitionByPath } from "./path.js";
import type { Schema } from "./schema.js";

describe("getSchemaDefinitionByPath", () => {
  it("should return the property definition for an object schema", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
      },
    };
    const result = getSchemaDefinitionByPath(schema, schema, ["foo"]);
    expect(result).toEqual({ type: "string" });
  });

  it("should return the item definition for an array schema", () => {
    const schema: Schema = {
      type: "array",
      items: { type: "number" },
    };
    const result = getSchemaDefinitionByPath(schema, schema, [0]);
    expect(result).toEqual({ type: "number" });
  });

  it("should return undefined when the path does not exist", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
      },
    };
    const result = getSchemaDefinitionByPath(schema, schema, ["bar"]);
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
    const result = getSchemaDefinitionByPath(schema, schema, [
      "nested",
      "value",
    ]);
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
    const result = getSchemaDefinitionByPath(schema, schema, ["foo"]);
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
    const result = getSchemaDefinitionByPath(schema, schema, ["alt"]);
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
    const result = getSchemaDefinitionByPath(schema, schema, [
      "How old is your pet?",
    ]);
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
    const result = getSchemaDefinitionByPath(schema, schema, ["water"]);
    expect(result).toEqual({
      type: "string",
      enum: ["lake", "sea"],
    });
  });
});
