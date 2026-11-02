import { describe, expect, test } from "vitest";

import {
  getRenderedOptionSchema,
  rendersOwnFieldBesideOption,
} from "./get-rendered-option-schema.js";
import { ADDITIONAL_PROPERTY_FLAG, REF_FLAG, type Schema } from "./schema.js";
import { createMerger } from "./test-merger.js";

// Upstream `mergeSchemas()` unions `required` and drops keys holding
// `undefined`; the stub returns those results explicitly.
const merger = createMerger({
  merges: [
    {
      left: { required: ["a"], type: "object" },
      right: { required: ["b"] },
      result: { required: ["a", "b"], type: "object" },
    },
    {
      left: { type: "object" },
      right: { required: ["a"] },
      result: { type: "object", required: ["a"] },
    },
    {
      left: { required: ["a"], type: "object" },
      right: {
        type: undefined,
        required: undefined,
        properties: { b: { minLength: 1 } },
      },
      result: { properties: { b: { minLength: 1 } } },
    },
    {
      left: { type: ["object", "null"] },
      right: { required: ["a"] },
      result: { type: ["object", "null"], required: ["a"] },
    },
    {
      left: { maxItems: 1 },
      right: { maxItems: 9 },
      result: { maxItems: 9 },
    },
  ],
});

function rendered(parent: Schema, option: Schema): Schema {
  return getRenderedOptionSchema(merger, parent, option);
}

describe("getRenderedOptionSchema()", () => {
  describe("a non-object parent", () => {
    test("passes on every keyword describing the value, such as an array's items and uniqueItems", () => {
      const parent: Schema = {
        type: "array",
        items: { type: "string", enum: ["a", "b"] },
        uniqueItems: true,
        oneOf: [{ minItems: 1 }],
      };
      expect(rendered(parent, { minItems: 1 })).toEqual({
        type: "array",
        items: { type: "string", enum: ["a", "b"] },
        uniqueItems: true,
        minItems: 1,
      });
    });

    test("passes on a string's format", () => {
      expect(
        rendered(
          { type: "string", format: "date", anyOf: [] },
          { minLength: 1 }
        )
      ).toEqual({ type: "string", format: "date", minLength: 1 });
    });

    // CHANGED: Upstream also keeps `deprecated`, `$anchor`, `$dynamicAnchor` and
    // `$vocabulary` on the parent. They are not draft-07 keywords the core
    // `Schema` supports (the draft-2020-12 converter drops them), so they are
    // not part of this case.
    test("keeps the options, the annotations, the default and the schema document keywords on the parent", () => {
      const parent: Schema = {
        $id: "parent",
        $schema: "http://json-schema.org/draft-07/schema#",
        $comment: "a comment",
        $defs: { a: { type: "string" } },
        definitions: { b: { type: "string" } },
        type: "string",
        title: "Parent",
        description: "The parent",
        default: "x",
        discriminator: { propertyName: "kind" },
        anyOf: [{ minLength: 1 }],
        oneOf: [{ maxLength: 5 }],
      };
      expect(rendered(parent, { minLength: 1 })).toEqual({
        type: "string",
        minLength: 1,
      });
    });

    test("keeps the parent's Symbol-keyed markers on the parent", () => {
      const parent: Schema = {
        type: "string",
        [ADDITIONAL_PROPERTY_FLAG]: true,
      };
      expect(
        Object.getOwnPropertySymbols(rendered(parent, { minLength: 1 }))
      ).toEqual([]);
    });

    test("merges an option's items into the parent's", () => {
      const parent: Schema = { type: "array", items: { type: "string" } };
      expect(
        rendered(parent, { type: "array", items: { minLength: 1 } })
      ).toEqual({
        type: "array",
        items: { type: "string", minLength: 1 },
      });
    });

    test("lets the option's own keyword win where the two cannot be combined into one value", () => {
      const parent: Schema = {
        type: "string",
        format: "date",
        pattern: "^a",
        multipleOf: 2,
      };
      expect(
        rendered(parent, { format: "email", pattern: "^b", multipleOf: 3 })
      ).toEqual({
        type: "string",
        format: "email",
        pattern: "^b",
        multipleOf: 3,
      });
    });

    test.each<[string, Schema, Schema, number]>([
      ["the smaller maxItems", { maxItems: 3 }, { maxItems: 5 }, 3],
      [
        "the smaller maxItems when the option is the stricter",
        { maxItems: 5 },
        { maxItems: 3 },
        3,
      ],
      ["the smaller maxLength", { maxLength: 4 }, { maxLength: 9 }, 4],
      [
        "the smaller maxProperties",
        { maxProperties: 2 },
        { maxProperties: 7 },
        2,
      ],
      ["the smaller maximum", { maximum: 10 }, { maximum: 20 }, 10],
      [
        "the smaller exclusiveMaximum",
        { exclusiveMaximum: 10 },
        { exclusiveMaximum: 20 },
        10,
      ],
      ["the larger minItems", { minItems: 2 }, { minItems: 1 }, 2],
      ["the larger minLength", { minLength: 1 }, { minLength: 3 }, 3],
      [
        "the larger minProperties",
        { minProperties: 4 },
        { minProperties: 1 },
        4,
      ],
      ["the larger minimum", { minimum: 0 }, { minimum: -5 }, 0],
      [
        "the larger exclusiveMinimum",
        { exclusiveMinimum: 0 },
        { exclusiveMinimum: 5 },
        5,
      ],
    ])(
      "keeps %s that both declare, since a value has to meet both",
      (_, parentBound, optionBound, expected) => {
        const [key] = Object.keys(parentBound);
        expect(
          rendered({ type: "number", ...parentBound }, optionBound)
        ).toEqual({ type: "number", [key!]: expected });
      }
    );

    test("keeps the stricter bound within a keyword the two both declare a schema for, such as an array's items", () => {
      const parent: Schema = {
        type: "array",
        items: { type: "string", maxLength: 5 },
      };
      expect(
        rendered(parent, { items: { maxLength: 10, minLength: 1 } })
      ).toEqual({
        type: "array",
        items: { type: "string", maxLength: 5, minLength: 1 },
      });
    });

    test("keeps the parent's subschema where the option's is true, since true adds nothing to meet", () => {
      const parent: Schema = {
        type: "array",
        items: {
          type: "object",
          properties: { a: { type: "string" }, b: { type: "number" } },
        },
      };
      expect(rendered(parent, { items: true })).toEqual(parent);
      expect(
        rendered(parent, {
          items: { properties: { a: true, b: { minimum: 1 } } },
        })
      ).toEqual({
        type: "array",
        items: {
          type: "object",
          properties: {
            a: { type: "string" },
            b: { type: "number", minimum: 1 },
          },
        },
      });
    });

    test("keeps the parent's false subschema where the option gives a schema, since nothing meets false", () => {
      const parent: Schema = {
        type: "array",
        items: {
          type: "object",
          properties: { a: false },
          additionalProperties: false,
        },
      };
      const option: Schema = {
        items: {
          properties: { a: { type: "string" } },
          additionalProperties: { type: "string" },
        },
      };
      expect(rendered(parent, option)).toEqual(parent);
    });

    test("keeps the parent's false subschema where the option's is true", () => {
      const parent: Schema = {
        type: "array",
        items: false,
        additionalItems: false,
      };
      expect(rendered(parent, { items: true, additionalItems: true })).toEqual(
        parent
      );
      expect(rendered(parent, { items: [{ type: "string" }] })).toEqual(parent);
    });

    test("keeps the parent's tuple where the option's items is true", () => {
      const parent: Schema = {
        type: "array",
        items: [{ type: "string" }, { type: "number" }],
      };
      expect(rendered(parent, { items: true })).toEqual(parent);
    });

    test("meets each position of the parent's tuple, and the items past it, with the option's items schema", () => {
      const parent: Schema = {
        type: "array",
        items: [{ type: "string", maxLength: 5 }, true],
      };
      expect(
        rendered(parent, { items: { maxLength: 9, minLength: 1 } })
      ).toEqual({
        type: "array",
        items: [
          { type: "string", maxLength: 5, minLength: 1 },
          { maxLength: 9, minLength: 1 },
        ],
      });
      const open: Schema = {
        ...parent,
        additionalItems: { type: "string", maxLength: 5 },
      };
      expect(rendered(open, { items: { maxLength: 9, minLength: 1 } })).toEqual(
        {
          type: "array",
          items: [
            { type: "string", maxLength: 5, minLength: 1 },
            { maxLength: 9, minLength: 1 },
          ],
          additionalItems: { type: "string", maxLength: 5, minLength: 1 },
        }
      );
      const closed: Schema = {
        type: "array",
        items: [{ type: "string" }],
        additionalItems: false,
      };
      expect(rendered(closed, { items: { minLength: 1 } })).toEqual({
        type: "array",
        items: [{ type: "string", minLength: 1 }],
        additionalItems: false,
      });
    });

    test("meets each position of the option's tuple, and the items past it, with the parent's items schema", () => {
      const parent: Schema = {
        type: "array",
        items: { type: "string", maxLength: 5 },
      };
      expect(
        rendered(parent, {
          items: [{ minLength: 1 }],
          additionalItems: { maxLength: 9 },
        })
      ).toEqual({
        type: "array",
        items: [{ type: "string", maxLength: 5, minLength: 1 }],
        additionalItems: { type: "string", maxLength: 5 },
      });
    });

    test("keeps the option's additionalItems past a parent that allows no items", () => {
      const parent: Schema = {
        type: "array",
        items: false,
      };
      expect(
        rendered(parent, {
          items: [{ type: "string" }],
          additionalItems: { type: "number" },
        })
      ).toEqual({
        type: "array",
        items: false,
        additionalItems: { type: "number" },
      });
    });

    test.each<[string, Schema, Schema]>([
      [
        "the parent's",
        { type: "array", items: [{ type: "string" }, { type: "string" }] },
        { items: { maxLength: 3 } },
      ],
      [
        "the option's",
        { type: "array", items: { type: "string" } },
        { items: [{ maxLength: 3 }, { maxLength: 3 }] },
      ],
    ])(
      "keeps %s tuple declaring no additionalItems at its length, as ArrayField renders it",
      (_, parent, option) => {
        expect(rendered(parent, option)).toEqual({
          type: "array",
          items: [
            { type: "string", maxLength: 3 },
            { type: "string", maxLength: 3 },
          ],
        });
      }
    );

    // CHANGED: Upstream also meets `prefixItems` tuples position by position.
    // `prefixItems` is a draft-2020-12 keyword our draft-07 `Schema` does not
    // support; the draft-2020-12 converter rewrites it to `items` before core
    // sees a schema, so there is nothing to meet here.
    //
    // test("meets two tuples position by position, keeping the positions only one of them describes", () => {
    //   const parent = {
    //     type: "array",
    //     prefixItems: [{ type: "string", maxLength: 5 }, { type: "number" }],
    //   } as unknown as Schema;
    //   const option = { prefixItems: [{ maxLength: 9 }] } as unknown as Schema;
    //   expect(rendered(parent, option)).toEqual({
    //     type: "array",
    //     prefixItems: [{ type: "string", maxLength: 5 }, { type: "number" }],
    //   });
    //   expect(rendered(option, parent)).toEqual({
    //     type: "array",
    //     prefixItems: [{ maxLength: 5, type: "string" }, { type: "number" }],
    //   });
    // });

    test("takes a list of schemas to combine, such as an allOf, as the option has it rather than by position", () => {
      const parent: Schema = {
        type: "array",
        items: { allOf: [{ maxLength: 5 }] },
      };
      expect(
        rendered(parent, { items: { allOf: [{ minLength: 1 }] } })
      ).toEqual({
        type: "array",
        items: { allOf: [{ minLength: 1 }] },
      });
    });

    test("meets an option's property only with a property the parent declares itself", () => {
      const parent: Schema = {
        type: "array",
        items: {
          type: "object",
          properties: { a: { type: "string" } },
        },
      };
      expect(
        rendered(parent, { items: { properties: { constructor: true } } })
      ).toEqual({
        type: "array",
        items: {
          type: "object",
          properties: { a: { type: "string" }, constructor: true },
        },
      });
    });

    test.each<[string, string[]]>([
      ["a value the parent does not list", ["a", "b", "c"]],
      ["its own order", ["c", "b"]],
    ])(
      "takes the option's enum whole, which its ui:enumNames are read by position against, with %s",
      (_, values) => {
        const parent: Schema = {
          type: "array",
          items: { type: "string", enum: ["b", "c"] },
        };
        expect(rendered(parent, { items: { enum: values } })).toEqual({
          type: "array",
          items: { type: "string", enum: values },
        });
      }
    );

    test.each<[string, Schema, Schema]>([
      [
        "option",
        { title: "Item", maxLength: 10 },
        { $ref: "#/definitions/short" },
      ],
      ["parent", { $ref: "#/definitions/short" }, { maxLength: 10 }],
    ])(
      "leaves a subschema the %s's $ref names to the field's allOf merge, where the root schema resolves it",
      (_, parentItems, optionItems) => {
        expect(
          rendered(
            { type: "array", items: parentItems },
            { items: optionItems }
          )
        ).toEqual({
          type: "array",
          items: { allOf: [parentItems, optionItems] },
        });
      }
    );

    test("asks for every name either required list asks for, whatever type the two name", () => {
      expect(rendered({ required: ["a"] }, { required: ["b", "a"] })).toEqual({
        required: ["a", "b"],
      });
    });

    test("takes a not both declare as the option has it, rather than merging the two into one neither declared", () => {
      expect(
        rendered(
          { type: "string", not: { maxLength: 3 } },
          { not: { minLength: 5 } }
        )
      ).toEqual({ type: "string", not: { minLength: 5 } });
    });

    test("replaces the parent's conditional with the one the option declares, keyword by keyword as a whole", () => {
      const parent: Schema = {
        type: "string",
        if: { minLength: 1 },
        then: { maxLength: 5 },
        else: { maxLength: 9 },
      };
      expect(
        rendered(parent, { if: { minLength: 2 }, then: { pattern: "^a" } })
      ).toEqual({
        type: "string",
        if: { minLength: 2 },
        then: { pattern: "^a" },
      });
      expect(rendered(parent, { minLength: 1 })).toEqual({
        ...parent,
        minLength: 1,
      });
    });

    test("takes a const or default object both declare as the option has it, rather than merging the two values", () => {
      const parent: Schema = {
        type: "array",
        items: { type: "object", default: { a: 1 }, const: { a: 1 } },
      };
      const option: Schema = {
        items: { default: { b: 2 }, const: { b: 2 } },
      };
      expect(rendered(parent, option)).toEqual({
        type: "array",
        items: { type: "object", default: { b: 2 }, const: { b: 2 } },
      });
    });

    test("leaves an option's true within not or if as the option's, where true constrains the value", () => {
      const parent: Schema = {
        type: "string",
        not: { maxLength: 3 },
        if: { minLength: 1 },
      };
      expect(rendered(parent, { not: true, if: true })).toEqual({
        type: "string",
        not: true,
        if: true,
      });
    });

    test("keeps uniqueItems when either asks for it", () => {
      expect(
        rendered({ type: "array", uniqueItems: true }, { uniqueItems: false })
      ).toEqual({ type: "array", uniqueItems: true });
      expect(
        rendered({ type: "array", uniqueItems: false }, { uniqueItems: true })
      ).toEqual({ type: "array", uniqueItems: true });
    });

    // CHANGED: `exclusiveMaximum` is a number in draft-07; the draft-04 boolean
    // form upstream keeps is not a valid draft-07 schema, so it is not supported.
    //
    // test("keeps an option bound that is not a number, such as a draft-04 boolean exclusiveMaximum, as the option has it", () => {
    //   const parent = {
    //     type: "number",
    //     maximum: 10,
    //     exclusiveMaximum: 5,
    //   } as Schema;
    //   const option = {
    //     maximum: 8,
    //     exclusiveMaximum: true,
    //   } as unknown as Schema;
    //   expect(rendered(parent, option)).toEqual({
    //     type: "number",
    //     maximum: 8,
    //     exclusiveMaximum: true,
    //   });
    // });

    test("does not search a value keyword, such as a const object, for bounds", () => {
      const parent: Schema = {
        type: "array",
        const: { maximum: 1 },
        examples: [{ maxItems: 1 }],
      };
      expect(rendered(parent, { const: { maximum: 9 } })).toEqual({
        type: "array",
        const: { maximum: 9 },
        examples: [{ maxItems: 1 }],
      });
    });

    test("does not search a keyword JSON Schema does not define for bounds", () => {
      const parent: Schema & Record<string, unknown> = {
        type: "array",
        "x-limits": { maxItems: 1 },
      };
      const option: Schema & Record<string, unknown> = {
        "x-limits": { maxItems: 9 },
      };
      expect(rendered(parent, option)).toEqual({
        type: "array",
        "x-limits": { maxItems: 9 },
      });
    });

    test("does not search a not for bounds, where the looser of the two is what a value has to clear", () => {
      expect(
        rendered(
          { type: "string", not: { maxLength: 3 } },
          { not: { maxLength: 5 } }
        )
      ).toEqual({ type: "string", not: { maxLength: 5 } });
    });

    test("reads the entries of a properties map as schemas rather than as keywords", () => {
      const parent: Schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            uniqueItems: true,
            a: { type: "string", maxLength: 5 },
          },
        },
      };
      const option: Schema = {
        items: {
          properties: {
            uniqueItems: { type: "string" },
            a: { maxLength: 9 },
            b: { type: "number" },
          },
        },
      };
      expect(rendered(parent, option)).toEqual({
        type: "array",
        items: {
          type: "object",
          properties: {
            uniqueItems: { type: "string" },
            a: { type: "string", maxLength: 5 },
            b: { type: "number" },
          },
        },
      });
    });

    test("passes on every type a parent allowing several types names", () => {
      expect(
        rendered({ type: ["string", "number"] }, { minLength: 1 })
      ).toEqual({ type: ["string", "number"], minLength: 1 });
    });

    test("leaves an option naming its own type with that type, over the parent's", () => {
      expect(rendered({ type: "string" }, { type: "null" })).toEqual({
        type: "null",
      });
    });

    test("returns the option itself when the parent has nothing to pass on", () => {
      const option: Schema = { minLength: 1 };
      expect(rendered({ title: "Parent", anyOf: [option] }, option)).toBe(
        option
      );
    });

    test("reads an option key holding undefined as declaring nothing, leaving the parent's keyword in place", () => {
      const parent: Schema = {
        type: "array",
        items: { type: "string", maxLength: 3 },
        maxItems: 3,
      };
      const result = rendered(parent, {
        title: "A",
        items: { maxLength: undefined },
        maxItems: undefined,
        minItems: undefined,
      });
      expect(result).toEqual({
        type: "array",
        items: { type: "string", maxLength: 3 },
        maxItems: 3,
        title: "A",
      });
      expect(result).not.toHaveProperty("minItems");
    });

    test("reads a property entry or tuple position holding undefined as declaring nothing, keeping the parent's", () => {
      const parent: Schema = {
        type: "array",
        items: [
          { type: "object", properties: { a: { type: "string" } } },
          { type: "number" },
        ],
      };
      expect(
        rendered(parent, {
          items: [{ properties: { a: undefined } }, undefined],
        } as unknown as Schema)
      ).toEqual(parent);
    });

    test("reads a parent subschema holding undefined as declaring nothing, keeping the option's true", () => {
      const parent = {
        type: "array",
        items: { type: "object", properties: { a: undefined } },
      } as unknown as Schema;
      expect(rendered(parent, { items: { properties: { a: true } } })).toEqual({
        type: "array",
        items: { type: "object", properties: { a: true } },
      });
      expect(
        rendered({ type: "array", items: undefined }, { items: true })
      ).toEqual({ type: "array", items: true });
    });

    test("keeps the symbol markers of an option it reads undefined keys out of, at every level it meets", () => {
      const parent: Schema = {
        type: "array",
        items: { type: "string" },
        maxItems: 3,
      };
      const items: Schema = {
        maxLength: 2,
        [REF_FLAG]: "#/definitions/item",
      };
      const result = rendered(parent, {
        items,
        maxItems: undefined,
        [REF_FLAG]: "#/definitions/option",
      });
      expect(result[REF_FLAG]).toBe("#/definitions/option");
      const resultItems = result.items;
      if (
        typeof resultItems !== "object" ||
        resultItems === null ||
        Array.isArray(resultItems)
      ) {
        throw new Error("expected the option's items schema");
      }
      expect(resultItems[REF_FLAG]).toBe("#/definitions/item");
      expect(result.maxItems).toBe(3);
    });
  });

  describe("an object parent", () => {
    const properties: Schema["properties"] = {
      a: { type: "string" },
      b: { type: "string" },
    };

    test("passes on only its required list and its type, since its own ObjectField renders the rest", () => {
      const parent: Schema = {
        type: "object",
        properties,
        required: ["a"],
        minProperties: 1,
      };
      expect(rendered(parent, { required: ["b"] })).toEqual({
        type: "object",
        required: ["a", "b"],
      });
    });

    test("passes on the object type it was read as when it names no type of its own", () => {
      expect(rendered({ properties }, { required: ["a"] })).toEqual({
        type: "object",
        required: ["a"],
      });
    });

    test("leaves an option naming its own type with that type, over the parent's", () => {
      expect(
        rendered({ properties }, { type: "object", required: ["a"] })
      ).toEqual({ type: "object", required: ["a"] });
    });

    test("reads an option's type or required list holding undefined as declaring nothing, passing on the parent's", () => {
      const parent: Schema = {
        type: "object",
        properties,
        required: ["a"],
      };
      const option: Schema = {
        type: undefined,
        required: undefined,
        properties: { b: { minLength: 1 } },
      };
      expect(rendered(parent, option)).toStrictEqual({
        type: "object",
        required: ["a"],
        properties: { b: { minLength: 1 } },
      });
    });

    test("passes on the type list of a nullable object", () => {
      expect(
        rendered({ type: ["object", "null"], properties }, { required: ["a"] })
      ).toEqual({ type: ["object", "null"], required: ["a"] });
    });
  });
});

describe("rendersOwnFieldBesideOption()", () => {
  test.each<[string, Schema, boolean]>([
    ["an object", { type: "object" }, true],
    [
      "a schema read as an object for its properties",
      { properties: { a: { type: "string" } } },
      true,
    ],
    ["an array", { type: "array", items: { type: "string" } }, false],
    ["a typeless schema", {}, false],
  ])("reads %s as rendering its own field: %s", (_, schema, expected) => {
    expect(rendersOwnFieldBesideOption(schema)).toBe(expected);
  });

  // CHANGED: Upstream reads the type only from `type`, `const`, `enum`,
  // `properties`, `additionalProperties`, `patternProperties` and
  // `unevaluatedProperties`; it does not look into the options. We reuse
  // `getSimpleSchemaType()`, so a typeless parent whose options are objects is
  // read as an object.
  test("reads a typeless parent with an object option as an object", () => {
    expect(
      rendersOwnFieldBesideOption({
        oneOf: [{ type: "object" }, { type: "string" }],
      })
    ).toBe(true);
  });
});
