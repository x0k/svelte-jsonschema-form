import { describe, expect, it } from "vitest";

import { schemaRequiresTrueValue } from "./constant-schema.js";

describe("schemaRequiresTrueValue()", () => {
  it("returns true for `const: true`", () => {
    expect(schemaRequiresTrueValue({ type: "boolean", const: true })).toBe(
      true
    );
  });

  it("returns true for a single-value `enum` containing only `true`", () => {
    expect(schemaRequiresTrueValue({ type: "boolean", enum: [true] })).toBe(
      true
    );
  });

  it("returns false for `const: false` and other constants", () => {
    expect(schemaRequiresTrueValue({ type: "boolean", const: false })).toBe(
      false
    );
    expect(schemaRequiresTrueValue({ type: "boolean", const: 1 })).toBe(false);
  });

  it("returns false when the schema also allows `false`", () => {
    expect(
      schemaRequiresTrueValue({ type: "boolean", enum: [true, false] })
    ).toBe(false);
  });

  it("checks single `anyOf` and `oneOf` alternatives", () => {
    expect(
      schemaRequiresTrueValue({ anyOf: [{ type: "boolean", const: true }] })
    ).toBe(true);
    expect(
      schemaRequiresTrueValue({ oneOf: [{ type: "boolean", const: true }] })
    ).toBe(true);
  });

  it("checks every `allOf` branch", () => {
    expect(
      schemaRequiresTrueValue({
        allOf: [{ type: "boolean" }, { const: true }],
      })
    ).toBe(true);
  });

  it("does not treat a multi-option schema as requiring `true`", () => {
    expect(
      schemaRequiresTrueValue({
        anyOf: [{ type: "boolean", const: true }, { type: "boolean" }],
      })
    ).toBe(false);
  });
});
