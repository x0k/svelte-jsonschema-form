import type { JSONSchema } from "json-schema-typed/draft-2020-12";
import { describe, it, expect } from "vitest";

import type { Schema } from "@/core/index.js";

import { convert } from "./draft-2020-12.js";

describe("$schema", () => {
  it("rewrites any $schema value to draft-07", () => {
    expect(
      convert({ $schema: "https://json-schema.org/draft/2020-12/schema" })
        .$schema
    ).toBe("http://json-schema.org/draft-07/schema");
  });
});

describe("pass-through keywords", () => {
  const cases: Array<[string, unknown]> = [
    ["title", "My title"],
    ["description", "desc"],
    ["required", ["a", "b"]],
    ["enum", [1, "two", null]],
    ["default", { x: 1 }],
    ["pattern", "^[a-z]+$"],
    ["examples", [1, 2]],
    ["exclusiveMaximum", 10],
    ["exclusiveMinimum", 0],
    ["format", "email"],
    ["minimum", 1],
    ["maximum", 100],
    ["multipleOf", 5],
    ["minLength", 2],
    ["maxLength", 20],
    ["minItems", 1],
    ["maxItems", 5],
    ["minProperties", 1],
    ["maxProperties", 10],
    ["readOnly", true],
    ["writeOnly", false],
    ["uniqueItems", true],
    ["const", 42],
    ["contentEncoding", "base64"],
    ["contentMediaType", "image/png"],
  ];

  for (const [key, value] of cases) {
    it(`preserves ${key}`, () => {
      expect(convert({ [key]: value })[key as keyof Schema]).toEqual(value);
    });
  }
});

// ---------------------------------------------------------------------------
// type
// ---------------------------------------------------------------------------

describe("type", () => {
  it("passes through a string type", () => {
    expect(convert({ type: "string" }).type).toBe("string");
  });

  it("passes through a union type array", () => {
    expect(convert({ type: ["string", "null"] }).type).toEqual([
      "string",
      "null",
    ]);
  });
});

// ---------------------------------------------------------------------------
// $ref
// ---------------------------------------------------------------------------

describe("$ref", () => {
  it("keeps local refs unchanged", () => {
    expect(convert({ $ref: "#/$defs/Foo" }).$ref).toBe("#/$defs/Foo");
  });

  it("converts an absolute $ref URL to a local $defs pointer", () => {
    const result = convert({
      $id: "https://example.com/schemas/main.json",
      $ref: "https://example.com/schemas/other.json",
    });
    expect(result.$ref).toBe(
      "#/$defs/https:~1~1example.com~1schemas~1other.json"
    );
  });

  it("converts a relative $ref URL using the base $id", () => {
    const result = convert({
      $id: "https://example.com/schemas/main.json",
      $ref: "other.json",
    });
    expect(result.$ref).toBe(
      "#/$defs/https:~1~1example.com~1schemas~1other.json"
    );
  });

  it("preserves the hash fragment when converting $ref", () => {
    const result = convert({
      $id: "https://example.com/main.json",
      $ref: "https://example.com/other.json#/$defs/Bar",
    });
    expect(result.$ref).toBe(
      "#/$defs/https:~1~1example.com~1other.json/$defs/Bar"
    );
  });
});

describe("$defs", () => {
  it("recursively converts nested schemas inside $defs", () => {
    const result = convert({
      $defs: {
        Foo: { type: "string", minLength: 1 },
      },
    });
    expect(result.$defs?.Foo).toEqual({ type: "string", minLength: 1 });
  });

  it("preserves boolean schemas inside $defs", () => {
    const result = convert({ $defs: { Never: false } });
    expect(result.$defs?.Never).toBe(false);
  });
});

describe("definitions (deprecated)", () => {
  it("passes through definitions converting nested schemas", () => {
    const result = convert({ definitions: { Foo: { type: "number" } } });
    expect(result.definitions?.Foo).toEqual({ type: "number" });
  });
});

describe("properties", () => {
  it("recursively converts each property schema", () => {
    const result = convert({
      properties: {
        name: { type: "string" },
        age: { type: "integer" },
      },
    });
    expect(result.properties).toEqual({
      name: { type: "string" },
      age: { type: "integer" },
    });
  });
});

describe("additionalProperties", () => {
  it("converts a schema value", () => {
    expect(
      convert({ additionalProperties: { type: "boolean" } })
        .additionalProperties
    ).toEqual({ type: "boolean" });
  });

  it("passes through a boolean value", () => {
    expect(convert({ additionalProperties: false }).additionalProperties).toBe(
      false
    );
  });
});

describe("patternProperties (bug fix)", () => {
  it("converts each pattern's schema — not the whole record as a single schema", () => {
    const result = convert({
      patternProperties: {
        "^S_": { type: "string" },
        "^I_": { type: "integer" },
      },
    });
    expect(result.patternProperties).toEqual({
      "^S_": { type: "string" },
      "^I_": { type: "integer" },
    });
  });
});

describe("propertyNames", () => {
  it("converts the propertyNames schema", () => {
    expect(convert({ propertyNames: { minLength: 1 } }).propertyNames).toEqual({
      minLength: 1,
    });
  });
});

describe("items", () => {
  it("maps items to items when there are no prefixItems", () => {
    const result = convert({ items: { type: "string" } });
    expect(result.items).toEqual({ type: "string" });
    expect(result.additionalItems).toBeUndefined();
  });

  it("maps items to additionalItems when prefixItems is present", () => {
    const result = convert({
      prefixItems: [{ type: "string" }],
      items: { type: "number" },
    });
    expect(result.additionalItems).toEqual({ type: "number" });
    expect(result.items).toEqual([{ type: "string" }]);
  });
});

describe("prefixItems", () => {
  it("maps an array of prefixItems to items array", () => {
    const result = convert({
      prefixItems: [{ type: "string" }, { type: "number" }],
    });
    expect(result.items).toEqual([{ type: "string" }, { type: "number" }]);
  });
});

describe("additionalItems (deprecated)", () => {
  it("passes through additionalItems schema", () => {
    expect(
      convert({ additionalItems: { type: "boolean" } }).additionalItems
    ).toEqual({ type: "boolean" });
  });
});

describe("applicators", () => {
  it("recursively converts allOf", () => {
    expect(
      convert({ allOf: [{ type: "string" }, { minLength: 1 }] }).allOf
    ).toEqual([{ type: "string" }, { minLength: 1 }]);
  });

  it("recursively converts anyOf", () => {
    expect(
      convert({ anyOf: [{ type: "string" }, { type: "null" }] }).anyOf
    ).toEqual([{ type: "string" }, { type: "null" }]);
  });

  it("recursively converts oneOf", () => {
    expect(convert({ oneOf: [{ const: 1 }, { const: 2 }] }).oneOf).toEqual([
      { const: 1 },
      { const: 2 },
    ]);
  });

  it("recursively converts not", () => {
    expect(convert({ not: { type: "string" } }).not).toEqual({
      type: "string",
    });
  });

  it("recursively converts if/then/else", () => {
    const result = convert({
      if: { type: "string" },
      then: { minLength: 1 },
      else: { type: "null" },
    });
    expect(result.if).toEqual({ type: "string" });
    expect(result.then).toEqual({ minLength: 1 });
    expect(result.else).toEqual({ type: "null" });
  });

  it("recursively converts contains", () => {
    expect(convert({ contains: { type: "number" } }).contains).toEqual({
      type: "number",
    });
  });
});

describe("dependentSchemas", () => {
  it("converts dependentSchemas entries into dependencies", () => {
    const result = convert({
      dependentSchemas: {
        credit_card: { required: ["billing_address"] },
      },
    });
    expect(result.dependencies?.credit_card).toEqual({
      required: ["billing_address"],
    });
  });
});

describe("dependentRequired", () => {
  it("converts dependentRequired entries into dependencies", () => {
    const result = convert({
      dependentRequired: {
        credit_card: ["billing_address"],
      },
    });
    expect(result.dependencies?.credit_card).toEqual(["billing_address"]);
  });

  it("merges dependentSchemas and dependentRequired into the same dependencies object", () => {
    const result = convert({
      dependentSchemas: { a: { type: "string" } },
      dependentRequired: { b: ["c"] },
    });
    expect(Object.keys(result.dependencies as object).sort()).toEqual([
      "a",
      "b",
    ]);
  });
});

describe("dependencies (deprecated)", () => {
  it("passes through array-form dependencies", () => {
    const result = convert({
      dependencies: { credit_card: ["billing_address"] },
    });
    expect(result.dependencies?.credit_card).toEqual(["billing_address"]);
  });

  it("converts schema-form dependencies", () => {
    const result = convert({
      dependencies: { foo: { type: "string" } },
    });
    expect(result.dependencies?.foo).toEqual({ type: "string" });
  });
});

// ---------------------------------------------------------------------------
// unevaluatedItems (lossy → additionalItems)
// ---------------------------------------------------------------------------

describe("unevaluatedItems", () => {
  it("maps unevaluatedItems to additionalItems when not already set", () => {
    const result = convert({ unevaluatedItems: { type: "string" } });
    expect(result.additionalItems).toEqual({ type: "string" });
  });

  it("does NOT overwrite additionalItems already set by the items handler (bug fix)", () => {
    // items + prefixItems → items handler writes additionalItems = {type:"number"}
    // unevaluatedItems should not clobber that
    const result = convert({
      prefixItems: [{ type: "string" }],
      items: { type: "number" },
      unevaluatedItems: { type: "boolean" },
    });
    expect(result.additionalItems).toEqual({ type: "number" });
  });

  it("accepts a boolean false value", () => {
    const result = convert({ unevaluatedItems: false });
    expect(result.additionalItems).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// unevaluatedProperties (lossy → additionalProperties)
// ---------------------------------------------------------------------------

describe("unevaluatedProperties", () => {
  it("maps unevaluatedProperties to additionalProperties when not already set", () => {
    const result = convert({ unevaluatedProperties: { type: "string" } });
    expect(result.additionalProperties).toEqual({ type: "string" });
  });

  it("does NOT overwrite an explicit additionalProperties", () => {
    const result = convert({
      additionalProperties: { type: "number" },
      unevaluatedProperties: { type: "boolean" },
    });
    expect(result.additionalProperties).toEqual({ type: "number" });
  });

  it("accepts a boolean false value", () => {
    const result = convert({ unevaluatedProperties: false });
    expect(result.additionalProperties).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// $anchor / $dynamicAnchor (lossy → $id fragment)
// ---------------------------------------------------------------------------

describe("$anchor", () => {
  it("converts $anchor to an $id fragment when no $id is present", () => {
    expect(convert({ $anchor: "myAnchor" }).$id).toBe("#myAnchor");
  });

  it("does NOT overwrite an explicit $id (bug fix)", () => {
    expect(
      convert({ $id: "https://example.com/foo", $anchor: "bar" }).$id
    ).toBe("https://example.com/foo");
  });
});

describe("$dynamicAnchor", () => {
  it("converts $dynamicAnchor to an $id fragment when no $id is present", () => {
    expect(convert({ $dynamicAnchor: "items" }).$id).toBe("#items");
  });

  it("does NOT overwrite an explicit $id (bug fix)", () => {
    expect(
      convert({ $id: "https://example.com/foo", $dynamicAnchor: "items" }).$id
    ).toBe("https://example.com/foo");
  });
});

// ---------------------------------------------------------------------------
// $dynamicRef (lossy → $ref)
// ---------------------------------------------------------------------------

describe("$dynamicRef", () => {
  it("keeps a fragment-only $dynamicRef as a plain $ref", () => {
    expect(convert({ $dynamicRef: "#items" }).$ref).toBe("#items");
  });

  it("converts an absolute $dynamicRef URL to a $defs pointer", () => {
    const result = convert({
      $id: "https://example.com/main.json",
      $dynamicRef: "https://example.com/other.json",
    });
    expect(result.$ref).toBe("#/$defs/https:~1~1example.com~1other.json");
  });
});

// ---------------------------------------------------------------------------
// dropped / unsupported keywords
// ---------------------------------------------------------------------------

describe("dropped keywords", () => {
  it("drops contentSchema", () => {
    expect(
      "contentSchema" in convert({ contentSchema: { type: "object" } })
    ).toBe(false);
  });

  it("drops $vocabulary", () => {
    expect(
      "$vocabulary" in
        convert({
          $vocabulary: {
            // "https://json-schema.org/draft/2020-12/vocab/core": true,
          },
        })
    ).toBe(false);
  });
});

describe("minContains / maxContains (carried over as custom keywords)", () => {
  it("passes through minContains", () => {
    expect("minContains" in convert({ minContains: 2 })).toBe(true);
  });

  it("passes through maxContains", () => {
    expect("maxContains" in convert({ maxContains: 5 })).toBe(true);
  });
});

describe("integration", () => {
  it("converts a realistic 2020-12 schema end-to-end", () => {
    const input = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/schemas/order.json",
      title: "Order",
      type: "object",
      properties: {
        id: { type: "string" },
        items: {
          type: "array",
          prefixItems: [{ type: "string" }],
          items: { type: "number" },
        },
        address: { $ref: "address.json" },
      },
      dependentRequired: { address: ["city"] },
      unevaluatedProperties: false,
    };

    const result = convert(input);

    expect(result).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      $id: "https://example.com/schemas/order.json",
      title: "Order",
      type: "object",
      properties: {
        id: { type: "string" },
        items: {
          type: "array",
          items: [{ type: "string" }],
          additionalItems: { type: "number" },
        },
        address: {
          $ref: "#/$defs/https:~1~1example.com~1schemas~1address.json",
        },
      },
      dependencies: { address: ["city"] },
      additionalProperties: false,
    });
  });

  it("recursive schema using $dynamicAnchor + $dynamicRef", () => {
    // 2020-12 idiomatic recursive list schema
    const input = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/schemas/tree.json",
      $dynamicAnchor: "node",
      type: "object",
      properties: {
        value: { type: "number" },
        children: {
          type: "array",
          items: { $dynamicRef: "#node" },
        },
      },
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      // $dynamicAnchor loses to explicit $id via ??=
      $id: "https://example.com/schemas/tree.json",
      type: "object",
      properties: {
        value: { type: "number" },
        children: {
          type: "array",
          // $dynamicRef fragment-only → plain $ref
          items: { $ref: "#node" },
        },
      },
    });
  });

  it("tuple schema using prefixItems + unevaluatedItems", () => {
    // strict tuple: two typed prefix slots, nothing else allowed
    const input = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      unevaluatedItems: false,
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      type: "array",
      items: [{ type: "string" }, { type: "number" }],
      // unevaluatedItems → additionalItems (nothing set it first)
      additionalItems: false,
    });
  });

  it("tuple schema where items takes priority over unevaluatedItems", () => {
    // items is present alongside prefixItems → items handler
    // writes additionalItems; unevaluatedItems must not overwrite it
    const input = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "array",
      prefixItems: [{ type: "string" }],
      items: false, // nothing beyond prefix
      unevaluatedItems: { type: "number" }, // should be ignored
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      type: "array",
      items: [{ type: "string" }],
      additionalItems: false, // from items, not unevaluatedItems
    });
  });

  it("open object schema using unevaluatedProperties across allOf", () => {
    // unevaluatedProperties is 2020-12's way to seal an allOf composition
    const input: JSONSchema.Interface = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      allOf: [
        { properties: { name: { type: "string" } } },
        { properties: { age: { type: "integer" } } },
      ],
      unevaluatedProperties: false,
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      allOf: [
        { properties: { name: { type: "string" } } },
        { properties: { age: { type: "integer" } } },
      ],
      additionalProperties: false,
    });
  });

  it("unevaluatedProperties does not overwrite explicit additionalProperties", () => {
    const input = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: { name: { type: "string" } },
      additionalProperties: { type: "string" },
      unevaluatedProperties: false, // should be ignored
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      properties: { name: { type: "string" } },
      additionalProperties: { type: "string" },
    });
  });

  it("array schema with contains + minContains + maxContains", () => {
    // minContains/maxContains have no draft-07 equivalent but are kept as
    // custom keywords so downstream tools that understand them can use them
    const input = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "array",
      contains: { type: "number", minimum: 0 },
      minContains: 2,
      maxContains: 5,
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      type: "array",
      contains: { type: "number", minimum: 0 },
      minContains: 2, // carried over as custom keyword
      maxContains: 5,
    });
  });

  it("drops contentSchema, deprecated and $vocabulary without touching sibling keywords", () => {
    const input: JSONSchema.Interface = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $vocabulary: {
        // "https://json-schema.org/draft/2020-12/vocab/core": true,
      },
      type: "string",
      contentEncoding: "base64",
      contentMediaType: "image/png",
      contentSchema: { type: "object" }, // dropped
      deprecated: true, // dropped
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      type: "string",
      contentEncoding: "base64",
      contentMediaType: "image/png",
      // contentSchema, deprecated, $vocabulary absent
    });
  });

  it("cross-file $ref resolution with $anchor fallback in referenced $defs", () => {
    // Models a bundle where an external schema is inlined under $defs and
    // its $anchor should not overwrite the $id set from the $defs key loop
    const input = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/main.json",
      $defs: {
        address: {
          $id: "https://example.com/address.json",
          $anchor: "address", // should not clobber $id
          type: "object",
          properties: {
            city: { type: "string" },
          },
        },
      },
      properties: {
        billing: { $ref: "https://example.com/address.json" },
      },
    };

    expect(convert(input)).toEqual({
      $schema: "http://json-schema.org/draft-07/schema",
      $id: "https://example.com/main.json",
      $defs: {
        address: {
          $id: "https://example.com/address.json", // preserved, not overwritten by $anchor
          type: "object",
          properties: { city: { type: "string" } },
        },
      },
      properties: {
        billing: { $ref: "#/$defs/https:~1~1example.com~1address.json" },
      },
    });
  });
});
