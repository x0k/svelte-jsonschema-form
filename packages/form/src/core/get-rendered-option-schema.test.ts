import { describe, expect, test } from "vitest";

import {
  getRenderedOptionSchema,
  rendersOwnFieldBesideOption,
} from "./get-rendered-option-schema.js";
import type { Schema } from "./schema.js";
import { createMerger } from "./test-merger.js";

const merger = createMerger({
  merges: [
    {
      left: { required: ["kind"], type: "object" },
      right: { properties: { value: { type: "string" } } },
      result: { title: "merged" },
    },
    {
      left: { type: "object" },
      right: { required: ["value"] },
      result: { title: "merged" },
    },
    {
      left: { type: "string" },
      right: { title: "Option" },
      result: { title: "merged" },
    },
  ],
});

function rendered(parent: Schema, option: Schema): Schema {
  return getRenderedOptionSchema(merger, parent, option);
}

describe("getRenderedOptionSchema()", () => {
  test("passes a non-object parent's value keywords to its option", () => {
    expect(
      rendered(
        { type: "string", format: "date" },
        { title: "First", maxLength: 10 }
      )
    ).toEqual({
      type: "string",
      title: "First",
      format: "date",
      maxLength: 10,
    });
  });

  test("keeps the stricter bound from the parent and option", () => {
    expect(
      rendered(
        { type: "array", items: { type: "string" }, maxItems: 3 },
        { uniqueItems: true, maxItems: 5 }
      )
    ).toEqual({
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
      maxItems: 3,
    });
  });

  test("keeps the parent's tuple when the option accepts any items", () => {
    expect(
      rendered(
        { type: "array", items: [{ type: "string" }], additionalItems: false },
        { items: true, maxItems: 2 }
      )
    ).toEqual({
      type: "array",
      items: [{ type: "string" }],
      additionalItems: false,
      maxItems: 2,
    });
  });

  test("does not pass an object parent's properties to its option", () => {
    expect(
      rendered(
        {
          type: "object",
          required: ["kind"],
          properties: { kind: { type: "string" } },
          title: "Parent",
        },
        { properties: { value: { type: "string" } } }
      )
    ).toEqual({
      title: "merged",
      required: ["kind"],
      type: "object",
    });
  });

  test("renders a typeless object parent's option as an object", () => {
    expect(
      rendered(
        { properties: { kind: { type: "string" } } },
        { required: ["value"] }
      )
    ).toEqual({ title: "merged", type: "object" });
  });

  test("merges a value keyword holding objects", () => {
    const parent: Schema = { type: "string" };
    const option: Schema = { title: "Option" };
    const parentWithExtension = Object.assign(parent, {
      "x-extra": { type: "string" },
    });
    const optionWithExtension = Object.assign(option, {
      "x-extra": { title: "Option" },
    });
    expect(rendered(parentWithExtension, optionWithExtension)).toEqual({
      type: "string",
      title: "Option",
      "x-extra": { title: "merged" },
    });
  });

  test("detects whether the schema renders its own field", () => {
    expect(rendersOwnFieldBesideOption({ type: "object" })).toBe(true);
    expect(rendersOwnFieldBesideOption({ type: ["null", "object"] })).toBe(
      true
    );
    expect(rendersOwnFieldBesideOption({ type: "string" })).toBe(false);
  });
});
