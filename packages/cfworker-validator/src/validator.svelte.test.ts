import { describe, expect, it } from "vitest";

import { createFormValidator } from "./validator.svelte.js";
import type { Schema } from "@sjsf/form";

describe("Validator", () => {
  it("Should properly evaluate title from json schema with $ref`s", () => {
    const schema: Schema = {
      definitions: {
        node: {
          type: "object",
          properties: {
            name: {
              type: "string",
              title: "title",
            },
            children: {
              type: "array",
              items: {
                $ref: "#/definitions/node",
              },
            },
          },
        },
      },
      type: "object",
      properties: {
        tree: {
          title: "Recursive references",
          $ref: "#/definitions/node",
        },
      },
    };
    const value = {
      tree: {
        children: [
          {
            children: [
              {
                name: NaN,
              },
            ],
          },
        ],
      },
    };

    const validator = createFormValidator();
    const errors = validator.validateFormValue(schema, value);
    expect(errors[errors.length - 1]?.propertyTitle).toBe("title");
  });
  it("Should handle undefined", () => {
    const schema: Schema = {
      title: "A registration form",
      description: "A simple form example.",
      type: "object",
      required: ["firstName", "items"],
      properties: {
        firstName: {
          type: "string",
          title: "First name",
          default: "Chuck",
        },
        items: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    };
    const value = {
      firstName: undefined,
      items: [undefined, "value"],
    };
    const validator = createFormValidator();
    const errors = validator.validateFormValue(schema, value);
    expect(errors).toEqual([
      {
        instanceId: "root",
        propertyTitle: "A registration form",
        message: 'Instance does not have required property "firstName".',
        error: {
          instanceLocation: "#",
          keyword: "required",
          keywordLocation: "#/required",
          error: 'Instance does not have required property "firstName".',
        },
      },
      {
        instanceId: "root",
        propertyTitle: "A registration form",
        message: 'Property "items" does not match schema.',
        error: {
          instanceLocation: "#",
          keyword: "properties",
          keywordLocation: "#/properties",
          error: 'Property "items" does not match schema.',
        },
      },
      {
        instanceId: "root.items",
        propertyTitle: "items",
        message: "Items did not match schema.",
        error: {
          instanceLocation: "#/items",
          keyword: "items",
          keywordLocation: "#/properties/items/items",
          error: "Items did not match schema.",
        },
      },
      {
        instanceId: "root.items.0",
        propertyTitle: "0",
        message: 'Instance type "null" is invalid. Expected "string".',
        error: {
          instanceLocation: "#/items/0",
          keyword: "type",
          keywordLocation: "#/properties/items/items/type",
          error: 'Instance type "null" is invalid. Expected "string".',
        },
      },
    ]);
  });
});
