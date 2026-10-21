import { beforeEach, describe, expect, it } from "vitest";

import type { Merger, Schema, Validator } from "#core/index.js";
import { createMerger } from "#core/test-merger.js";
import { createValidator } from "#core/test-validator.js";

import { dropStaleDefaults } from "./drop-stale-defaults.js";

let testValidator: Validator;
let defaultMerger: Merger;

beforeEach(() => {
  testValidator = createValidator();
  defaultMerger = createMerger();
});

const oldSchema: Schema = {
  type: "object",
  properties: {
    mode: { type: "string" },
    value: {
      type: "object",
      properties: {
        branch: { type: "string", default: "first" },
      },
      default: { branch: "first" },
    },
  },
};

const newSchema: Schema = {
  type: "object",
  properties: {
    mode: { type: "string" },
    value: {
      type: "object",
      properties: {
        branch: { type: "string", default: "second" },
      },
      default: { branch: "second" },
    },
  },
};

describe("dropStaleDefaults", () => {
  it("drops an object property that still holds the swapped-away branch's default", () => {
    const formData = { mode: "second", value: { branch: "first" } };
    const oldFormData = { mode: "first", value: { branch: "first" } };

    expect(
      dropStaleDefaults(
        testValidator,
        defaultMerger,
        newSchema,
        newSchema,
        oldSchema,
        formData,
        oldFormData
      )
    ).toEqual({ mode: "second" });
  });

  it("keeps a value the user changed away from the old default", () => {
    const formData = { mode: "second", value: { branch: "edited" } };
    const oldFormData = { mode: "first", value: { branch: "edited" } };

    expect(
      dropStaleDefaults(
        testValidator,
        defaultMerger,
        newSchema,
        newSchema,
        oldSchema,
        formData,
        oldFormData
      )
    ).toBe(formData);
  });

  it("keeps a value when both branches declare the same default", () => {
    const formData = { mode: "second", value: { branch: "first" } };
    const oldFormData = { mode: "first", value: { branch: "first" } };

    expect(
      dropStaleDefaults(
        testValidator,
        defaultMerger,
        oldSchema,
        oldSchema,
        oldSchema,
        formData,
        oldFormData
      )
    ).toBe(formData);
  });

  it("drops a stale default nested in an object property", () => {
    const oldNestedSchema: Schema = {
      type: "object",
      properties: {
        cfg: {
          type: "object",
          properties: {
            kind: {
              type: "object",
              properties: {
                branch: { type: "string", default: "first" },
              },
              default: { branch: "first" },
            },
          },
        },
      },
    };
    const newNestedSchema: Schema = {
      type: "object",
      properties: {
        cfg: {
          type: "object",
          properties: {
            kind: {
              type: "object",
              properties: {
                branch: { type: "string", default: "second" },
              },
              default: { branch: "second" },
            },
          },
        },
      },
    };

    expect(
      dropStaleDefaults(
        testValidator,
        defaultMerger,
        newNestedSchema,
        newNestedSchema,
        oldNestedSchema,
        { cfg: { kind: { branch: "first" } } },
        { cfg: { kind: { branch: "first" } } }
      )
    ).toEqual({ cfg: {} });
  });
});
