import { describe, it, expect } from "vitest";

import { getUiSchemaByPath, type UiSchema } from "./ui-schema.js";

describe("getUiSchemaByPath", () => {
  it("should return undefined if schema is undefined", () => {
    expect(getUiSchemaByPath(undefined, ["a"])).toBeUndefined();
  });

  it("should return the nested schema for property lookup", () => {
    const schema: UiSchema = {
      a: {
        b: {
          "ui:options": { title: "foo" },
        },
      },
    };
    const result = getUiSchemaByPath(schema, ["a", "b"]);
    expect(result).toEqual({
      "ui:options": { title: "foo" },
    });
  });

  it("should access schema in array items", () => {
    const schema: UiSchema = {
      items: [
        {
          "ui:options": { title: "foo" },
        },
      ],
    };
    const result = getUiSchemaByPath(schema, [0]);
    expect(result).toEqual({
      "ui:options": { title: "foo" },
    });
  });

  it("should return value using additionalProperties", () => {
    const schema: UiSchema = {
      additionalProperties: {
        "ui:options": { title: "foo" },
      },
    };
    const result = getUiSchemaByPath(schema, ["randomKey"]);
    expect(result).toEqual({
      "ui:options": { title: "foo" },
    });
  });

  it("should return value using additionalItems", () => {
    const schema: UiSchema = {
      additionalItems: {
        "ui:options": { title: "foo" },
      },
    };
    const result = getUiSchemaByPath(schema, [0]);
    expect(result).toEqual({
      "ui:options": { title: "foo" },
    });
  });

  it("should use anyOf alternative when available", () => {
    const schema: UiSchema = {
      anyOf: [
        {
          a: {
            "ui:options": { title: "foo" },
          },
        },
        {
          a: {
            "ui:options": { title: "bar" },
          },
        },
      ],
    };
    const result = getUiSchemaByPath(schema, ["a"]);
    expect(result).toEqual({
      "ui:options": { title: "foo" },
    });
  });

  it("should use oneOf alternative when available", () => {
    const schema: UiSchema = {
      oneOf: [
        {
          b: {
            "ui:options": { title: "foo" },
          },
        },
        {
          b: {
            "ui:options": { title: "bar" },
          },
        },
      ],
    };
    const result = getUiSchemaByPath(schema, ["b"]);
    expect(result).toEqual({
      "ui:options": { title: "foo" },
    });
  });

  it("should drill into nested alternative schemas", () => {
    const schema: UiSchema = {
      a: {
        anyOf: [
          {
            b: {
              "ui:options": { title: "foo" },
            },
          },
          {
            b: {
              "ui:options": { title: "bar" },
            },
          },
        ],
      },
    };
    const result = getUiSchemaByPath(schema, ["a", "b"]);
    expect(result).toEqual({
      "ui:options": { title: "foo" },
    });
  });
});
