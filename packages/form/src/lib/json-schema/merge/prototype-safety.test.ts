import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { describe, expect, it } from "vitest";

import { createMerger } from "./merge.js";

const { mergeSchemaDefinitions } = createMerger();

describe("prototype-named keys", () => {
  it("keeps a `constructor` pattern when the opposite side allows any additional properties", () => {
    const result = mergeSchemaDefinitions(
      {
        patternProperties: {
          constructor: { minLength: 1 },
        },
        additionalProperties: false,
      },
      { additionalProperties: true }
    ) as JSONSchema7;
    const patterns = result.patternProperties!;
    expect(Object.hasOwn(patterns, "constructor")).toBe(true);
    expect(patterns.constructor).toEqual({ minLength: 1 });
  });

  it("merges `additionalProperties` into a `constructor` pattern instead of the inherited value", () => {
    const result = mergeSchemaDefinitions(
      {
        patternProperties: {
          constructor: { minLength: 1 },
        },
      },
      { additionalProperties: { type: "string" } }
    ) as JSONSchema7;
    expect(result.patternProperties!.constructor).toEqual({
      minLength: 1,
      type: "string",
    });
  });

  it("does not treat an inherited property as the opposite side's declaration", () => {
    const withProperty = {
      properties: {
        constructor: { minLength: 1 },
      },
    } as const;
    const withNoProperties = { additionalProperties: false } as const;
    for (const [left, right] of [
      [withProperty, withNoProperties],
      [withNoProperties, withProperty],
    ] as const) {
      const result = mergeSchemaDefinitions(left, right) as JSONSchema7;
      expect(result.properties).toBeUndefined();
    }
  });

  it("keeps `__proto__` property names as own properties", () => {
    const result = mergeSchemaDefinitions(
      {
        properties: Object.fromEntries([["__proto__", { minLength: 1 }]]),
        additionalProperties: false,
      },
      {
        properties: Object.fromEntries([["__proto__", { type: "string" }]]),
      }
    ) as JSONSchema7;
    const properties = result.properties!;
    expect(Object.hasOwn(properties, "__proto__")).toBe(true);
    expect(Object.getPrototypeOf(properties)).toBe(Object.prototype);
    expect(properties["__proto__"]).toEqual({
      minLength: 1,
      type: "string",
    });
  });

  it("keeps `__proto__` pattern names as own properties", () => {
    const result = mergeSchemaDefinitions(
      {
        patternProperties: Object.fromEntries([
          ["__proto__", { minLength: 1 }],
        ]),
        additionalProperties: false,
      },
      { additionalProperties: true }
    ) as JSONSchema7;
    const patterns = result.patternProperties!;
    expect(Object.hasOwn(patterns, "__proto__")).toBe(true);
    expect(Object.getPrototypeOf(patterns)).toBe(Object.prototype);
    expect(patterns["__proto__"]).toEqual({ minLength: 1 });
  });

  it("keeps prototype-named `$defs` keys as own properties", () => {
    const result = mergeSchemaDefinitions(
      { $defs: {} },
      {
        $defs: Object.fromEntries([
          ["__proto__", { type: "string" }],
          ["constructor", { type: "number" }],
        ]),
      }
    ) as JSONSchema7;
    const defs = result.$defs!;
    expect(Object.hasOwn(defs, "__proto__")).toBe(true);
    expect(Object.hasOwn(defs, "constructor")).toBe(true);
    expect(Object.getPrototypeOf(defs)).toBe(Object.prototype);
    expect(defs["__proto__"]).toEqual({ type: "string" });
    expect(defs.constructor).toEqual({ type: "number" });
  });

  it("keeps prototype-named extension keywords as own properties", () => {
    // TS models object literals' inherited `constructor`, so build the schema
    // from entries like the other own-property cases.
    const right = Object.fromEntries([
      ["constructor", { type: "string" }],
    ]) as JSONSchema7Definition;
    const result = mergeSchemaDefinitions(
      { type: "object" },
      right
    ) as JSONSchema7;
    expect(Object.hasOwn(result, "constructor")).toBe(true);
    expect(result.constructor).toEqual({ type: "string" });
  });

  it("keeps a `__proto__` extension keyword as an own property", () => {
    const right = Object.fromEntries([
      ["__proto__", { type: "string" }],
    ]) as JSONSchema7Definition;
    const result = mergeSchemaDefinitions(
      { type: "object" },
      right
    ) as JSONSchema7;
    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(result, "__proto__")?.value).toEqual(
      { type: "string" }
    );
  });
});
