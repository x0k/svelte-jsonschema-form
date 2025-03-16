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
    const result = getSchemaDefinitionByPath(schema, schema, ["nested", "value"]);
    expect(result).toEqual({ type: "boolean" });
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
});
