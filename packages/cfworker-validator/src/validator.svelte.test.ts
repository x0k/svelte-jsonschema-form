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
});
