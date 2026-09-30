// This file was copied and modified from https://github.com/mokkabonna/json-schema-merge-allof/blob/1cc2aa53a5d33c17d0e9c59b13eed77d86ad91c3/test/specs/if-then-else.spec.js
// MIT © Martin Hansen
// Modifications made by Roman Krasilnikov.

import { Ajv } from "ajv";
import type { JSONSchema7Definition } from "json-schema";
import { describe, it, expect } from "vitest";

import { createShallowAllOfMerge } from "./all-of-merge.js";
import { createMerger } from "./merge.js";

const { mergeArrayOfSchemaDefinitions } = createMerger();
const mergeAllOf = createShallowAllOfMerge(mergeArrayOfSchemaDefinitions);

const ajv = new Ajv({ strict: false });

/**
 * Asserts that `merged` accepts exactly the instances `original` accepts.
 * A merged schema may be structurally different, but it must not be more or
 * less restrictive than what it was merged from.
 */
function expectEquivalent(
  original: JSONSchema7Definition,
  merged: JSONSchema7Definition,
  instances: unknown[]
) {
  const validateOriginal = ajv.compile(original);
  const validateMerged = ajv.compile(merged);
  for (const instance of instances) {
    expect(
      validateMerged(instance),
      `merged schema disagrees on ${JSON.stringify(instance)}`
    ).toBe(validateOriginal(instance));
  }
}

describe("if then else", function () {
  it("moves the if then else to the base schema if none there", () => {
    const result = mergeAllOf({
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });

    expect(result).toEqual({
      if: {
        required: ["prop1"],
      },
      then: {},
      else: {},
    });
  });

  it("does NOT move the if then else to the base schema if something already there", () => {
    const result = mergeAllOf({
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });

    expect(result).toEqual({
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });
  });

  it("moves the unaffected keywords to the base schema", () => {
    const result = mergeAllOf({
      properties: {
        name: {
          type: "string",
          minLength: 3,
        },
      },
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          properties: {
            name: {
              type: "string",
              minLength: 5,
            },
          },
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });

    expect(result).toEqual({
      properties: {
        name: {
          type: "string",
          minLength: 5,
        },
      },
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });
  });

  it("should not move to base schema if only some keywords are not present", () => {
    const condition: JSONSchema7Definition = {
      if: { required: ["prop1"] },
      then: {},
      else: {},
    };

    const result = mergeAllOf({ else: false, allOf: [condition] });
    expect(result).toEqual({ else: false, allOf: [condition] });

    const result2 = mergeAllOf({ then: false, allOf: [condition] });
    expect(result2).toEqual({ then: false, allOf: [condition] });

    const result3 = mergeAllOf({ if: false, allOf: [condition] });
    expect(result3).toEqual({ if: false, allOf: [condition] });
  });

  it("works with undefined value, it is as if not there. NOT the same as empty schema", () => {
    const result = mergeAllOf({
      if: undefined,
      then: undefined,
      else: undefined,
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });

    expect(result).toEqual({
      if: {
        required: ["prop1"],
      },
      then: {},
      else: {},
    });
  });

  it("removes empty allOf", () => {
    const result = mergeAllOf({
      if: {
        required: ["prop1"],
      },
      then: {},
      else: {},
      allOf: [
        {
          properties: {
            name: {
              type: "string",
            },
          },
        },
      ],
    });

    expect(result).toEqual({
      properties: {
        name: {
          type: "string",
        },
      },
      if: {
        required: ["prop1"],
      },
      then: {},
      else: {},
    });
  });

  describe("keeps each if/then/else together", () => {
    it("does not attach a later `else` to an earlier `if`", () => {
      const original: JSONSchema7Definition = {
        allOf: [{ if: false }, { if: true, else: false }],
      };
      const result = mergeAllOf(original);

      expect(result).toEqual({
        if: false,
        allOf: [{ if: true, else: false }],
      });
      // The original accepts everything, a stray `else: false` next to
      // `if: false` would reject everything.
      expectEquivalent(original, result, [0, "a", null, {}, []]);
    });

    it("does not attach a later `else` to an earlier `if`/`then`", () => {
      const original: JSONSchema7Definition = {
        allOf: [
          { if: { required: ["a"] }, then: { required: ["b"] } },
          { if: { required: ["c"] }, else: { required: ["d"] } },
        ],
      };
      const result = mergeAllOf(original);

      expect(result).toEqual({
        if: { required: ["a"] },
        then: { required: ["b"] },
        allOf: [{ if: { required: ["c"] }, else: { required: ["d"] } }],
      });
      expectEquivalent(original, result, [
        {},
        { a: 1 },
        { a: 1, b: 1 },
        { c: 1 },
        { d: 1 },
        { a: 1, b: 1, c: 1 },
        { a: 1, b: 1, d: 1 },
      ]);
    });

    it("does not attach a later `then` to an earlier `if`/`else`", () => {
      const original: JSONSchema7Definition = {
        allOf: [
          { if: { required: ["a"] }, else: { required: ["x"] } },
          {
            if: { required: ["b"] },
            then: { required: ["y"] },
            else: { required: ["z"] },
          },
        ],
      };
      const result = mergeAllOf(original);

      expect(result).toEqual({
        if: { required: ["a"] },
        else: { required: ["x"] },
        allOf: [
          {
            if: { required: ["b"] },
            then: { required: ["y"] },
            else: { required: ["z"] },
          },
        ],
      });
      expectEquivalent(original, result, [
        {},
        { a: 1, z: 1 },
        { a: 1, b: 1, y: 1 },
        { x: 1, z: 1 },
        { x: 1, b: 1, y: 1 },
      ]);
    });

    it("keeps a root `if` apart from a later `allOf` condition", () => {
      const original: JSONSchema7Definition = {
        if: { required: ["a"] },
        then: { required: ["b"] },
        allOf: [
          {
            if: { required: ["c"] },
            then: { required: ["d"] },
            else: { required: ["e"] },
          },
        ],
      };
      const result = mergeAllOf(original);

      expect(result).toEqual(original);
      expectEquivalent(original, result, [
        {},
        { e: 1 },
        { a: 1, b: 1, e: 1 },
        { c: 1, d: 1 },
        { a: 1, c: 1, d: 1 },
      ]);
    });

    it("does not attach a later `else` to an `if`/`then`", () => {
      const original: JSONSchema7Definition = {
        allOf: [
          { if: { required: ["a"] }, then: { required: ["b"] } },
          { else: { required: ["d"] } },
        ],
      };
      const result = mergeAllOf(original);

      expect(result).toEqual({
        if: { required: ["a"] },
        then: { required: ["b"] },
        allOf: [{ else: { required: ["d"] } }],
      });
      expectEquivalent(original, result, [
        {},
        { a: 1 },
        { a: 1, b: 1 },
        { a: 1, b: 1, d: 1 },
      ]);
    });

    it("does not attach a later `if`/`then` to an `else`", () => {
      const original: JSONSchema7Definition = {
        allOf: [
          { else: { required: ["x"] } },
          { if: { required: ["c"] }, then: { required: ["d"] } },
        ],
      };
      const result = mergeAllOf(original);

      expect(result).toEqual({
        else: { required: ["x"] },
        allOf: [{ if: { required: ["c"] }, then: { required: ["d"] } }],
      });
      expectEquivalent(original, result, [
        {},
        { x: 1 },
        { c: 1 },
        { c: 1, d: 1 },
      ]);
    });
  });
});
