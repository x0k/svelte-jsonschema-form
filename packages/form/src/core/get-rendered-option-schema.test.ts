import { describe, expect, test } from "vitest";

import { createMerger } from "../mergers/modern.js";
import { getRenderedOptionSchema } from "./get-rendered-option-schema.js";
import type { Schema } from "./schema.js";

const merger = createMerger();

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
      type: "object",
      required: ["kind"],
      properties: { value: { type: "string" } },
    });
  });

  test("renders a typeless object parent's option as an object", () => {
    expect(
      rendered(
        { properties: { kind: { type: "string" } } },
        { required: ["value"] }
      )
    ).toEqual({ type: "object", required: ["value"] });
  });
});
