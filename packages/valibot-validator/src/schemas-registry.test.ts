import { describe, expect, it } from "vitest";
import { isSchema } from "@sjsf/form/core";
import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";

import { createSchemaRegistry } from "./schemas-registry.js";
import { createAugmentedId } from "./model.js";

describe("SchemasRegistry", () => {
  it("toJsonSchema should generate expected JSON elements", () => {
    const ComprehensiveSchema = v.object({
      boolean: v.boolean(),
      number: v.number(),
      string: v.string(),
      enum: v.enum({
        Left: "LEFT",
        Right: "RIGHT",
      }),
      picklist: v.picklist(["active", "inactive", "pending"]),
      literal: v.literal("constant"),
      union: v.union([v.string(), v.number()]),
      object: v.object({
        street: v.string(),
        city: v.string(),
      }),
      array: v.array(
        v.object({
          id: v.number(),
          name: v.string(),
        })
      ),
      tuple: v.tuple([v.number(), v.number()]),
      record: v.record(v.string(), v.string()),
      variant: v.variant("type", [
        v.object({
          type: v.literal("email"),
          email: v.pipe(v.string(), v.email()),
        }),
        v.object({
          type: v.literal("url"),
          url: v.pipe(v.string(), v.url()),
        }),
        v.object({
          type: v.literal("date"),
          date: v.pipe(v.string(), v.isoDate()),
        }),
      ]),
      intersect: v.intersect([
        v.object({ foo: v.string() }),
        v.object({ bar: v.number() }),
      ]),
      optionalString: v.optional(v.string()), // string | undefined
      exactOptionalString: v.exactOptional(v.string()), // string
      undefinedableString: v.undefinedable(v.string()), // string | undefined
      nullableString: v.nullable(v.string()), // string | null
      nullishString: v.nullish(v.string()), // string | null | undefined
    });
    expect(toJsonSchema(ComprehensiveSchema)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema#",
      properties: {
        array: {
          items: {
            properties: {
              id: {
                type: "number",
              },
              name: {
                type: "string",
              },
            },
            required: ["id", "name"],
            type: "object",
          },
          type: "array",
        },
        boolean: {
          type: "boolean",
        },
        exactOptionalString: {
          type: "string",
        },
        literal: {
          const: "constant",
        },
        nullableString: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        nullishString: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        number: {
          type: "number",
        },
        object: {
          properties: {
            city: {
              type: "string",
            },
            street: {
              type: "string",
            },
          },
          required: ["street", "city"],
          type: "object",
        },
        optionalString: {
          type: "string",
        },
        enum: {
          enum: ["LEFT", "RIGHT"],
        },
        picklist: {
          enum: ["active", "inactive", "pending"],
        },
        record: {
          additionalProperties: {
            type: "string",
          },
          type: "object",
        },
        string: {
          type: "string",
        },
        tuple: {
          items: [
            {
              type: "number",
            },
            {
              type: "number",
            },
          ],
          minItems: 2,
          type: "array",
        },
        undefinedableString: {
          type: "string",
        },
        union: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        variant: {
          anyOf: [
            {
              properties: {
                email: {
                  format: "email",
                  type: "string",
                },
                type: {
                  const: "email",
                },
              },
              required: ["type", "email"],
              type: "object",
            },
            {
              properties: {
                type: {
                  const: "url",
                },
                url: {
                  format: "uri",
                  type: "string",
                },
              },
              required: ["type", "url"],
              type: "object",
            },
            {
              properties: {
                date: {
                  format: "date",
                  type: "string",
                },
                type: {
                  const: "date",
                },
              },
              required: ["type", "date"],
              type: "object",
            },
          ],
        },
        intersect: {
          allOf: [
            {
              properties: {
                foo: {
                  type: "string",
                },
              },
              required: ["foo"],
              type: "object",
            },
            {
              properties: {
                bar: {
                  type: "number",
                },
              },
              required: ["bar"],
              type: "object",
            },
          ],
        },
      },
      required: [
        "boolean",
        "number",
        "string",
        "enum",
        "picklist",
        "literal",
        "union",
        "object",
        "array",
        "tuple",
        "record",
        "variant",
        "intersect",
        "exactOptionalString",
        "undefinedableString",
        "nullableString",
      ],
      type: "object",
    });
  });
  it("should create augmented valibot schemas for object union members", () => {
    const registry = createSchemaRegistry();
    const { anyOf } = toJsonSchema(
      v.union([
        v.object({ foo: v.string() }),
        v.object({ bar: v.string(), baz: v.number() }),
      ]),
      {
        overrideSchema: registry.register,
      }
    );
    const definitions = anyOf ?? [];
    if (!definitions.every(isSchema)) {
      throw new Error("All `oneOf` elements must be schemas");
    }
    const [first, second] = definitions.map(({ $id: id }, i) => {
      if (id === undefined) {
        throw new Error(`$id is undefined for anyOf[${i}] item`);
      }
      const schema = registry.get(createAugmentedId(id));
      if (schema === undefined) {
        throw new Error(`Augmented schema is undefined for anyOf[${i}] item`);
      }
      return schema;
    });
    if (first === undefined || second === undefined) {
      throw new Error(`Augmented schemas are invalid`);
    }
    expect(v.safeParse(first, {})).toHaveProperty("success", false);
    expect(v.safeParse(first, { foo: "foo" })).toHaveProperty("success", true);
    expect(v.safeParse(second, { foo: "foo" })).toHaveProperty(
      "success",
      false
    );
    expect(v.safeParse(second, { bar: "bar" })).toHaveProperty("success", true);
  });
});
