import * as v from "valibot";
import { describe, it, expect } from "vitest";
import * as z from "zod/v4";

import type { PlaygroundValidator2 } from "./model.ts";
import {
  fromJsonSchema,
  getValidatorFormat,
  isDraft2020Validator,
  toJsonSchema,
} from "./schema-converter.ts";

function makeValidator(
  name: string,
  draft2020 = false,
  precompiled = false
): PlaygroundValidator2 {
  return { name, draft2020, precompiled } as PlaygroundValidator2;
}

describe("getValidatorFormat", () => {
  it("returns json-schema for JSON Schema validators", () => {
    expect(getValidatorFormat(makeValidator("ajv8"))).toBe("json-schema");
    expect(getValidatorFormat(makeValidator("cfworker"))).toBe("json-schema");
    expect(getValidatorFormat(makeValidator("schemasafe"))).toBe("json-schema");
    expect(getValidatorFormat(makeValidator("ata"))).toBe("json-schema");
  });

  it("returns json-schema for draft2020 validators", () => {
    expect(getValidatorFormat(makeValidator("ajv8", true))).toBe("json-schema");
  });

  it("returns json-schema for precompiled validators", () => {
    expect(getValidatorFormat(makeValidator("ajv8", false, true))).toBe(
      "json-schema"
    );
  });

  it("returns zod for zod4", () => {
    expect(getValidatorFormat(makeValidator("zod4"))).toBe("zod");
  });

  it("returns valibot for valibot", () => {
    expect(getValidatorFormat(makeValidator("valibot"))).toBe("valibot");
  });
});

describe("isDraft2020Validator", () => {
  it("returns true for draft2020 validators", () => {
    expect(isDraft2020Validator(makeValidator("ajv8", true))).toBe(true);
  });

  it("returns false for non-draft2020 validators", () => {
    expect(isDraft2020Validator(makeValidator("ajv8"))).toBe(false);
    expect(isDraft2020Validator(makeValidator("zod4"))).toBe(false);
  });
});

describe("fromJsonSchema", () => {
  it("wraps Zod output with import and export default", () => {
    const schema = JSON.stringify({ type: "string" });
    const result = fromJsonSchema(schema, "zod");
    expect(result).toMatchInlineSnapshot(`
      "import * as z from "zod";

      export default z.string()"
    `);
  });

  it("wraps Valibot output with import and replaces export const with export default", () => {
    const schema = JSON.stringify({ type: "string" });
    const result = fromJsonSchema(schema, "valibot");
    expect(result).toMatchInlineSnapshot(`
      "import * as v from 'valibot'

      export default v.string()
      "
    `);
  });

  it("converts draft2020 prefixItems to tuple via draft-07 conversion", () => {
    const schema = JSON.stringify({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
    });
    const result = fromJsonSchema(schema, "zod", true);
    expect(result).toContain("z.tuple");
  });

  it("skips draft2020 conversion when sourceDraft2020 is false", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { foo: { type: "string" } },
    });
    const result = fromJsonSchema(schema, "zod", false);
    expect(result).toContain("z.object");
    expect(result).toContain("z.string()");
  });

  it("skips draft2020 conversion when sourceDraft2020 is omitted", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { foo: { type: "string" } },
    });
    const result = fromJsonSchema(schema, "zod");
    expect(result).toContain("z.object");
    expect(result).toContain("z.string()");
  });
});

describe("toJsonSchema", () => {
  it("converts Zod schema to JSON string", () => {
    const schema = z.object({ name: z.string() });
    const result = toJsonSchema(schema, "zod");
    const parsed = JSON.parse(result);
    expect(parsed.type).toBe("object");
    expect(parsed.properties.name.type).toBe("string");
  });

  it("converts Valibot schema to JSON string", () => {
    const schema = v.object({ name: v.string() });
    const result = toJsonSchema(schema, "valibot");
    const parsed = JSON.parse(result);
    expect(parsed.type).toBe("object");
    expect(parsed.properties.name.type).toBe("string");
  });

  it("produces pretty-printed output", () => {
    const schema = z.object({ name: z.string() });
    const result = toJsonSchema(schema, "zod");
    expect(result).toContain("\n");
    expect(result).toContain("  ");
  });
});
