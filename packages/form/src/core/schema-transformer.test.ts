import { describe, expect, it } from "vitest";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { identity } from "@/lib/function.js";

import { transformSchemaDefinition } from "./schema-transformer.js";

describe("transformSchemaDefinition", () => {
  it("Should keep all elements", () => {
    const schema: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/schemas/everything.json",
      title: "Kitchen Sink Schema",
      description:
        "A schema demonstrating all kinds of JSON Schema Draft 7 keywords.",
      type: "object",
      default: {},
      examples: [
        {
          foo: "abc",
          bar: 42,
          baz: true,
          tags: ["x", "y"],
          nested: { qux: 3.14 },
          choice: { alpha: 1 },
          extra: "anything",
        },
      ],

      required: ["foo", "bar"],

      properties: {
        foo: {
          type: "string",
          minLength: 1,
          maxLength: 10,
          pattern: "^[a-z]+$",
          format: "email",
          enum: ["abc", "def", "ghi"],
          const: "abc",
        },
        bar: {
          type: "integer",
          minimum: 0,
          exclusiveMinimum: -1,
          maximum: 100,
          exclusiveMaximum: 101,
          multipleOf: 2,
        },
        baz: {
          type: "boolean",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          additionalItems: false,
          minItems: 1,
          maxItems: 5,
          uniqueItems: true,
          contains: { pattern: "x" },
        },
        nested: {
          type: "object",
          properties: {
            qux: {
              type: "number",
            },
          },
          patternProperties: {
            "^s_": { type: "string" },
          },
          additionalProperties: false,
          propertyNames: {
            pattern: "^[a-zA-Z0-9_]+$",
          },
          minProperties: 1,
          maxProperties: 5,
          dependencies: {
            qux: ["extraProp"],
            extraProp: {
              type: "string",
            },
          },
        },
        choice: {
          anyOf: [{ type: "string" }, { type: "number" }],
          oneOf: [{ minimum: 0, maximum: 10 }, { enum: ["special"] }],
          allOf: [
            { type: "object", properties: { alpha: { type: "number" } } },
            { required: ["alpha"] },
          ],
          not: {
            const: "forbidden",
          },
          if: {
            properties: { alpha: { const: 1 } },
          },
          then: {
            properties: { beta: { type: "string" } },
            required: ["beta"],
          },
          else: {
            properties: { gamma: { type: "boolean" } },
          },
        },
        extra: {
          description: "This demonstrates a ref",
          $ref: "#/definitions/stringLike",
        },
      },

      dependencies: {
        foo: ["bar"],
        bar: {
          properties: {
            baz: { type: "boolean" },
          },
          required: ["baz"],
        },
      },

      definitions: {
        stringLike: {
          anyOf: [{ type: "string" }, { type: "number", minimum: 0 }],
        },
      },
    };

    const result = transformSchemaDefinition<JSONSchema7Definition>(
      structuredClone(schema),
      identity
    );

    expect(result).toEqual(schema);
  });
});
