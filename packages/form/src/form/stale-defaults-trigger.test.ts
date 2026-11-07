import { describe, expect, it } from "vitest";

import type { Schema } from "#core/index.js";

import { getStaleDefaultsTriggerKeys } from "./stale-defaults-trigger.js";

function keys(schema: Schema) {
  const result = getStaleDefaultsTriggerKeys(schema);
  return result === undefined ? undefined : [...result].sort();
}

describe("getStaleDefaultsTriggerKeys()", () => {
  it("returns no keys for a schema without conditionals", () => {
    expect(
      keys({
        type: "object",
        properties: {
          name: { type: "string" },
        },
      })
    ).toEqual([]);
  });

  it("collects root dependency keys", () => {
    expect(
      keys({
        type: "object",
        properties: { mode: { type: "string" } },
        dependencies: {
          mode: { properties: { x: { type: "string" } } },
          other: ["mode"],
        },
      })
    ).toEqual(["mode", "other"]);
  });

  it("collects keys read by conditionals inside a dependency schema", () => {
    expect(
      keys({
        type: "object",
        dependencies: {
          a: {
            if: { properties: { b: { const: true } } },
            then: { properties: { x: { type: "string" } } },
          },
        },
      })
    ).toEqual(["a", "b"]);
  });

  it("collects the properties and required keys a root if reads", () => {
    expect(
      keys({
        type: "object",
        properties: { mode: { type: "string" } },
        if: {
          properties: { mode: { const: "a" } },
          required: ["kind"],
        },
        then: { properties: { x: { type: "string" } } },
      })
    ).toEqual(["kind", "mode"]);
  });

  it("returns undefined when a root if compares the whole value", () => {
    expect(
      keys({
        type: "object",
        if: { const: { mode: "a" } },
        then: { properties: { x: { type: "string" } } },
      })
    ).toBeUndefined();
  });

  it("attributes a nested conditional to its top-level property", () => {
    expect(
      keys({
        type: "object",
        properties: {
          wrapper: {
            type: "object",
            if: { properties: { mode: { const: "a" } } },
            then: { properties: { x: { type: "string" } } },
          },
        },
      })
    ).toEqual(["wrapper"]);
  });

  it("attributes conditionals inside array items to the array property", () => {
    expect(
      keys({
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              dependencies: { mode: { properties: { x: {} } } },
            },
          },
        },
      })
    ).toEqual(["items"]);
  });

  it("collects dependency keys for a root-level array's items", () => {
    expect(
      keys({
        type: "array",
        items: {
          type: "object",
          dependencies: { mode: { properties: { x: {} } } },
        },
      })
    ).toEqual(["mode"]);
  });

  it("follows local refs to conditionals", () => {
    expect(
      keys({
        type: "object",
        properties: {
          wrapper: { $ref: "#/$defs/wrapper" },
        },
        $defs: {
          wrapper: {
            type: "object",
            if: { properties: { mode: { const: "a" } } },
            then: { properties: { x: { type: "string" } } },
          },
        },
      })
    ).toEqual(["wrapper"]);
  });

  it("collects keys from a root if behind a local ref", () => {
    expect(
      keys({
        type: "object",
        if: { $ref: "#/$defs/condition" },
        then: { properties: { x: { type: "string" } } },
        $defs: {
          condition: {
            properties: { mode: { const: "a" } },
            required: ["kind"],
          },
        },
      })
    ).toEqual(["kind", "mode"]);
  });

  it("ignores unreferenced definitions", () => {
    expect(
      keys({
        type: "object",
        properties: { name: { type: "string" } },
        $defs: {
          unused: {
            type: "object",
            dependencies: { mode: {} },
          },
        },
      })
    ).toEqual([]);
  });

  it("collects conditionals from root allOf branches", () => {
    expect(
      keys({
        type: "object",
        allOf: [
          {
            dependencies: { mode: { properties: { x: {} } } },
          },
        ],
      })
    ).toEqual(["mode"]);
  });

  it("returns undefined for conditionals in root additionalProperties", () => {
    expect(
      keys({
        type: "object",
        additionalProperties: {
          type: "object",
          dependencies: { mode: {} },
        },
      })
    ).toBeUndefined();
  });

  it("returns undefined for an if with patternProperties", () => {
    expect(
      keys({
        type: "object",
        if: { patternProperties: { "^m": { const: "a" } } },
        then: { properties: { x: { type: "string" } } },
      })
    ).toBeUndefined();
  });

  it("unions keys from combinators in a root if", () => {
    expect(
      keys({
        type: "object",
        if: {
          anyOf: [
            { properties: { mode: { const: "a" } } },
            { properties: { kind: { const: "b" } } },
          ],
        },
        then: { properties: { x: { type: "string" } } },
      })
    ).toEqual(["kind", "mode"]);
  });

  it("supports an if at the root of array items", () => {
    expect(
      keys({
        type: "array",
        items: {
          type: "object",
          if: {
            properties: { mode: { const: "a" } },
            required: ["kind"],
          },
          then: { properties: { x: { type: "string" } } },
        },
      })
    ).toEqual(["kind", "mode"]);
  });
});
