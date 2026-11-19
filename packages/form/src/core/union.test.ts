import type { JSONSchema7TypeName } from "json-schema";
import { describe, expect, it } from "vitest";

import { ADDITIONAL_PROPERTY_FLAG, REF_FLAG, type Schema } from "./schema.js";
import {
  canUnionTypeShowData,
  castToUnionType,
  getInitialUnionTypeIndex,
  getUnionTypes,
  getUnionValueSchema,
  isUnionSchema,
} from "./union.js";

function initialType(
  types: JSONSchema7TypeName[],
  value: Parameters<typeof getInitialUnionTypeIndex>[1]
) {
  return types[getInitialUnionTypeIndex(types, value)];
}

describe("getUnionTypes", () => {
  it("returns the types when more than one can hold a value", () => {
    expect(getUnionTypes({ type: ["string", "number"] } as Schema)).toEqual(
      new Set(["string", "number"])
    );
    expect(
      getUnionTypes({ type: ["string", "number", "null"] } as Schema)
    ).toEqual(new Set(["string", "number", "null"]));
    expect(
      getUnionTypes({ type: ["string", "number", "boolean"] } as Schema)
    ).toEqual(new Set(["string", "number", "boolean"]));
  });

  it("treats a single or nullable single type as no union", () => {
    expect(getUnionTypes({ type: "string" } as Schema)).toBeUndefined();
    expect(
      getUnionTypes({ type: ["string", "null"] } as Schema)
    ).toBeUndefined();
    expect(
      getUnionTypes({ type: ["string", "string", "null"] } as Schema)
    ).toBeUndefined();
  });
});

describe("isUnionSchema", () => {
  it("leaves values pinned by const or enum on their plain field", () => {
    expect(
      isUnionSchema({
        type: ["string", "number"],
        const: "a",
      } as Schema)
    ).toBe(false);
    expect(
      isUnionSchema({
        type: ["string", "number"],
        enum: ["a", "b"],
      } as Schema)
    ).toBe(false);
  });

  it("accepts a schema offering several types", () => {
    expect(isUnionSchema({ type: ["string", "number"] } as Schema)).toBe(true);
  });
});

describe("castToUnionType", () => {
  it("writes text for scalars and clears containers", () => {
    expect(castToUnionType(12, "string")).toBe("12");
    expect(castToUnionType(true, "string")).toBe("true");
    expect(castToUnionType(null, "string")).toBe("");
    expect(castToUnionType({ a: 1 }, "string")).toBe("");
    expect(castToUnionType([1], "string")).toBe("");
  });

  it("parses decimal numbers the number field accepts", () => {
    expect(castToUnionType("3.5", "number")).toBe(3.5);
    expect(castToUnionType("-1e2", "number")).toBe(-100);
    expect(castToUnionType(7, "number")).toBe(7);
  });

  it("refuses values with no numeric reading", () => {
    expect(castToUnionType("abc", "number")).toBeUndefined();
    expect(castToUnionType("0x10", "number")).toBeUndefined();
    expect(castToUnionType("Infinity", "number")).toBeUndefined();
    expect(castToUnionType("", "number")).toBeUndefined();
    expect(castToUnionType(true, "number")).toBeUndefined();
    expect(castToUnionType(null, "number")).toBeUndefined();
  });

  it("refuses a fractional integer", () => {
    expect(castToUnionType("3.5", "integer")).toBeUndefined();
    expect(castToUnionType("3", "integer")).toBe(3);
  });

  it("reads boolean spellings", () => {
    expect(castToUnionType("false", "boolean")).toBe(false);
    expect(castToUnionType(" OFF ", "boolean")).toBe(false);
    expect(castToUnionType("yes", "boolean")).toBe(true);
    expect(castToUnionType("", "boolean")).toBeUndefined();
    expect(castToUnionType(null, "boolean")).toBeUndefined();
    expect(castToUnionType({}, "boolean")).toBeUndefined();
    expect(castToUnionType(false, "boolean")).toBe(false);
  });

  it("starts containers and nulls empty", () => {
    expect(castToUnionType("anything", "null")).toBeNull();
    expect(castToUnionType("anything", "array")).toEqual([]);
    expect(castToUnionType("anything", "object")).toEqual({});
  });
});

describe("getInitialUnionTypeIndex", () => {
  it("prefers the type of the current value", () => {
    expect(initialType(["string", "number"], "12")).toBe("string");
    expect(initialType(["string", "number"], 12.5)).toBe("number");
    expect(initialType(["string", "null"], null)).toBe("null");
    expect(initialType(["string", "object"], { a: 1 })).toBe("object");
    expect(initialType(["string", "array"], [1])).toBe("array");
  });

  it("takes an integer for a number or an integer, whichever is listed", () => {
    expect(initialType(["string", "integer"], 1)).toBe("integer");
    expect(initialType(["string", "number"], 1)).toBe("number");
  });

  it("skips a leading null when there is nothing to match", () => {
    expect(initialType(["null", "string", "number"], undefined)).toBe("string");
    expect(initialType(["null"], undefined)).toBe("null");
  });

  it("falls back to the first type when the value fits none", () => {
    expect(initialType(["string", "number"], null)).toBe("string");
  });
});

describe("canUnionTypeShowData", () => {
  it("lets textual types stand in for one another", () => {
    expect(canUnionTypeShowData("string", "number")).toBe(true);
    expect(canUnionTypeShowData("number", "string")).toBe(true);
    expect(canUnionTypeShowData("integer", "number")).toBe(true);
  });

  it("keeps every other type to its own data", () => {
    expect(canUnionTypeShowData("string", "boolean")).toBe(false);
    expect(canUnionTypeShowData("string", "null")).toBe(false);
    expect(canUnionTypeShowData("object", "array")).toBe(false);
    expect(canUnionTypeShowData("null", "null")).toBe(true);
  });
});

describe("getUnionValueSchema", () => {
  it("pins the type and keeps the value keywords", () => {
    const schema = {
      type: ["string", "number"],
      format: "email",
      default: "a@b.c",
    } as unknown as Schema;
    expect(getUnionValueSchema(schema, "string")).toEqual({
      type: "string",
      format: "email",
      default: "a@b.c",
    });
  });

  it("drops the union's title and description", () => {
    const schema = {
      type: ["string", "number"],
      title: "Union",
      description: "Union description",
    } as unknown as Schema;
    expect(getUnionValueSchema(schema, "string")).toEqual({ type: "string" });
  });

  it("drops resolution markers and the schema id", () => {
    const schema = {
      type: ["string", "number"],
      $id: "urn:test",
      [ADDITIONAL_PROPERTY_FLAG]: true,
      [REF_FLAG]: "urn:ref",
    } as unknown as Schema;
    const valueSchema = getUnionValueSchema(schema, "string");
    expect(valueSchema).not.toHaveProperty("$id");
    expect(ADDITIONAL_PROPERTY_FLAG in valueSchema).toBe(false);
    expect(REF_FLAG in valueSchema).toBe(false);
  });

  it("drops the option lists for a null value", () => {
    expect(
      getUnionValueSchema(
        {
          type: ["null", "string"],
          oneOf: [{ type: "string" }],
        } as Schema,
        "null"
      )
    ).toEqual({ type: "null" });
  });

  it("makes an undescribed object free-form", () => {
    expect(
      getUnionValueSchema({ type: ["string", "object"] } as Schema, "object")
    ).toEqual({ type: "object", additionalProperties: {} });
    expect(
      getUnionValueSchema(
        {
          type: ["string", "object"],
          properties: { a: { type: "string" } },
        } as Schema,
        "object"
      )
    ).toEqual({ type: "object", properties: { a: { type: "string" } } });
  });
});
