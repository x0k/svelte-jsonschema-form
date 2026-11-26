import { describe, expect, it } from "vitest";

import { isObjectSchemaExpandable } from "./is-expandable.js";
import type { Schema } from "./schema.js";

describe("isObjectSchemaExpandable", () => {
  it("allows adding keys when additionalProperties is a schema", () => {
    expect(
      isObjectSchemaExpandable(
        { additionalProperties: {} } as Schema,
        undefined
      )
    ).toBe(true);
    expect(
      isObjectSchemaExpandable(
        { additionalProperties: { type: "string" } } as Schema,
        undefined
      )
    ).toBe(true);
  });

  it("allows adding keys when additionalProperties is true", () => {
    expect(
      isObjectSchemaExpandable(
        { additionalProperties: true } as Schema,
        undefined
      )
    ).toBe(true);
    expect(
      isObjectSchemaExpandable({ additionalProperties: true } as Schema, {})
    ).toBe(true);
  });

  it("allows adding keys when unevaluatedProperties describes them", () => {
    expect(
      isObjectSchemaExpandable(
        {
          unevaluatedProperties: { type: "string" },
        } satisfies Schema,
        undefined
      )
    ).toBe(true);
    expect(
      isObjectSchemaExpandable(
        {
          additionalProperties: false,
          unevaluatedProperties: { type: "string" },
        } satisfies Schema,
        undefined
      )
    ).toBe(false);
  });

  it("allows adding keys when patternProperties is defined", () => {
    expect(
      isObjectSchemaExpandable(
        { patternProperties: { "^x-": { type: "string" } } } as Schema,
        undefined
      )
    ).toBe(true);
  });

  it("rejects a closed object", () => {
    expect(isObjectSchemaExpandable({} as Schema, undefined)).toBe(false);
    expect(
      isObjectSchemaExpandable({ additionalProperties: false } as Schema, {})
    ).toBe(false);
  });

  it("stops adding keys once maxProperties is reached", () => {
    const schema = {
      additionalProperties: true,
      maxProperties: 1,
    } as Schema;
    expect(isObjectSchemaExpandable(schema, { a: 1 })).toBe(false);
    expect(isObjectSchemaExpandable(schema, {})).toBe(true);
  });
});
