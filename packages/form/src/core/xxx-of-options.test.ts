// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/getXxxOfKey.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { describe, expect, expectTypeOf, it } from "vitest";

import type { UiSchemaDefinition } from "../form/ui-schema.js";
import { ANY_OF_KEY, ONE_OF_KEY, type Schema } from "./schema.js";
import type { SchemaDefinition } from "./schema.js";
import {
  getAllOfOptions,
  getXxxOfKey,
  getXxxOfOptions,
  type XxxOfKey,
} from "./xxx-of-options.js";

const CONST = [{ const: "a" }, { const: "b" }] satisfies Schema[];
const OTHER_CONST = [{ const: "x" }, { const: "y" }] satisfies Schema[];

describe("getXxxOfKey", () => {
  const cases: [string, Schema, XxxOfKey | undefined][] = [
    ["neither keyword", {}, undefined],
    ["only oneOf", { oneOf: CONST }, ONE_OF_KEY],
    ["only anyOf", { anyOf: CONST }, ANY_OF_KEY],
    // `anyOf` wins when both lists are populated
    ["both populated", { oneOf: CONST, anyOf: OTHER_CONST }, ANY_OF_KEY],
    [
      "both populated, reversed decl",
      { anyOf: CONST, oneOf: OTHER_CONST },
      ANY_OF_KEY,
    ],
    // An empty list offers nothing, so it never shadows a populated sibling
    [
      "empty oneOf, populated anyOf",
      { oneOf: [], anyOf: OTHER_CONST },
      ANY_OF_KEY,
    ],
    ["populated oneOf, empty anyOf", { oneOf: CONST, anyOf: [] }, ONE_OF_KEY],
    ["empty anyOf, populated oneOf", { anyOf: [], oneOf: CONST }, ONE_OF_KEY],
    ["both empty", { oneOf: [], anyOf: [] }, ANY_OF_KEY],
    // A non-array is not an option list at all
    ["oneOf not an array", { oneOf: {} as never }, undefined],
    ["anyOf not an array", { anyOf: {} as never, oneOf: CONST }, ONE_OF_KEY],
  ];

  it.each(cases)("returns the keyword for %s", (_name, schema, expected) => {
    expect(getXxxOfKey(schema)).toBe(expected);
  });
});

describe("getXxxOfOptions", () => {
  it("returns the options and the keyword they came from", () => {
    expect(getXxxOfOptions({ oneOf: CONST })).toEqual({
      key: ONE_OF_KEY,
      options: CONST,
    });
  });
  it("reads anyOf when both lists are populated", () => {
    expect(getXxxOfOptions({ oneOf: CONST, anyOf: OTHER_CONST })).toEqual({
      key: ANY_OF_KEY,
      options: OTHER_CONST,
    });
  });
  it("skips an empty list in favour of a populated sibling", () => {
    expect(getXxxOfOptions({ oneOf: [], anyOf: OTHER_CONST })).toEqual({
      key: ANY_OF_KEY,
      options: OTHER_CONST,
    });
    expect(getXxxOfOptions({ anyOf: [], oneOf: CONST })).toEqual({
      key: ONE_OF_KEY,
      options: CONST,
    });
  });
  // An empty list offers no option to render, take a type from or pick a default
  // from, so the schema is handled through its own type instead
  it.each([
    ["neither keyword", {}],
    ["empty oneOf", { oneOf: [] }],
    ["empty anyOf", { anyOf: [] }],
    ["both empty", { oneOf: [], anyOf: [] }],
  ])("returns undefined for %s", (_name, schema) => {
    expect(getXxxOfOptions(schema)).toBeUndefined();
  });

  // The option type is carried through rather than widened to `unknown`, so a
  // caller reading a UiSchema's options gets UiSchema definitions and a caller
  // reading a Schema's gets schemas, with no cast at either call site
  it("carries the option type through instead of widening it", () => {
    const schema: Schema = { oneOf: [{ type: "string" }] };
    expectTypeOf(getXxxOfOptions(schema)?.options).toEqualTypeOf<
      SchemaDefinition[] | undefined
    >();

    const uiSchema: { oneOf?: UiSchemaDefinition[] } = {
      oneOf: [{ "ui:options": { title: "t" } }],
    };
    expectTypeOf(getXxxOfOptions(uiSchema)?.options).toEqualTypeOf<
      UiSchemaDefinition[] | undefined
    >();
  });
});

describe("getAllOfOptions", () => {
  it("returns the options when present and populated", () => {
    const allOf = [{ type: "string" }] satisfies Schema[];
    expect(getAllOfOptions({ allOf })).toBe(allOf);
  });

  // The same option type as getXxxOfOptions(), so a caller reading `allOf` beside
  // `oneOf`/`anyOf` concatenates one type rather than a union of two. The explicit
  // `const alt: SchemaDefinition[] | undefined` in type.ts and path.ts is what
  // actually enforces it; this pins the option type on its own.
  it("carries the same option type as getXxxOfOptions()", () => {
    const schema: Schema = { allOf: [{ type: "string" }] };
    expectTypeOf(getAllOfOptions(schema)).toEqualTypeOf<
      SchemaDefinition[] | undefined
    >();
  });
  it.each([
    ["absent", {}],
    ["empty", { allOf: [] }],
    ["not an array", { allOf: {} as never }],
  ])("returns undefined when allOf is %s", (_name, schema) => {
    expect(getAllOfOptions(schema)).toBeUndefined();
  });
});
