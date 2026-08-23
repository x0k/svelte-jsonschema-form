import { createFormValidator } from "@sjsf/ajv8-validator";
import { DEFAULT_ID_PREFIX, type FieldPath } from "@sjsf/form";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { describe, expect, it } from "vitest";

import { createFormIdBuilder, createOptionIndexDecoder } from "./id-builder.js";

const p = (...segments: (string | number)[]) =>
  segments as unknown as FieldPath;

function builder({
  schema,
  value,
  idPrefix = DEFAULT_ID_PREFIX,
  isPrivate,
}: {
  schema: any;
  value?: any;
  idPrefix?: string;
  isPrivate?: (path: FieldPath) => boolean;
}) {
  const validator = createFormValidator();
  const merger = createFormMerger({ validator, schema });
  return createFormIdBuilder({
    schema,
    validator,
    merger,
    idPrefix,
    valueRef: { current: value },
    isPrivate,
  });
}

describe("createFormIdBuilder", () => {
  it("should build id for a simple string property", () => {
    const b = builder({
      schema: {
        type: "object",
        properties: { firstName: { type: "string" } },
      },
      value: { firstName: "John" },
    });
    expect(b.fromPath(p("firstName"))).toBe("root.firstName");
  });

  it("should build id for nested properties", () => {
    const b = builder({
      schema: {
        type: "object",
        properties: {
          address: {
            type: "object",
            properties: { city: { type: "string" } },
          },
        },
      },
      value: { address: { city: "NYC" } },
    });
    expect(b.fromPath(p("address", "city"))).toBe("root.address.city");
  });

  it("should build id for a numeric array index", () => {
    const b = builder({
      schema: {
        type: "object",
        properties: {
          items: { type: "array", items: { type: "string" } },
        },
      },
      value: { items: ["a", "b"] },
    });
    expect(b.fromPath(p("items", 0))).toBe("root.items[0]");
  });

  it("should build id with custom idPrefix", () => {
    const b = builder({
      schema: {
        type: "object",
        properties: { x: { type: "string" } },
      },
      idPrefix: "form1",
    });
    expect(b.fromPath(p("x"))).toBe("form1.x");
  });

  it("should prefix with underscore for private paths", () => {
    const b = builder({
      schema: {
        type: "object",
        properties: { x: { type: "string" } },
      },
      isPrivate: () => true,
    });
    expect(b.fromPath(p("x"))).toBe("_root.x");
  });

  it("should append [] for multiselect arrays", () => {
    const b = builder({
      schema: {
        type: "object",
        properties: {
          tags: {
            type: "array",
            uniqueItems: true,
            items: { type: "string", enum: ["a", "b", "c"] },
          },
        },
      },
      value: { tags: ["a"] },
    });
    expect(b.fromPath(p("tags"))).toBe("root.tags[]");
  });

  it("should handle path ending with a pseudo element", () => {
    const b = builder({
      schema: {
        type: "object",
        properties: { name: { type: "string" } },
      },
    });
    const result = b.fromPath(p("name", "__sjsf_pseudo_elementSerrors"));
    expect(result).toContain("root.name");
    expect(result).not.toContain("__sjsf_pseudo_element");
  });
});

describe("createOptionIndexDecoder", () => {
  it("should decode a valid encoded index", () => {
    const decode = createOptionIndexDecoder("::");
    expect(decode("::0.foo")).toBe(0);
    expect(decode("::5.bar")).toBe(5);
  });

  it("should return undefined for non-matching values", () => {
    const decode = createOptionIndexDecoder("::");
    expect(decode("something")).toBeUndefined();
    expect(decode("::abc.foo")).toBeUndefined();
  });

  it("should return undefined when no dot separator found", () => {
    const decode = createOptionIndexDecoder("::");
    expect(decode("::123")).toBeUndefined();
  });
});
