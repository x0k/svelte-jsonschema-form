import { describe, expect, it } from "vitest";

import type { EnumOption, SchemaValue, ValueComparer } from "#core/index.js";

import { StringEnumValueMapperBuilder } from "./options.svelte.js";

const comparer: ValueComparer = {
  isValueDeepEqual: (a, b) => Object.is(a, b),
};

function option(value: unknown, id = String(value)): EnumOption<SchemaValue> {
  return {
    id,
    value: value as SchemaValue,
    label: id,
    disabled: false,
  };
}

function build(...values: unknown[]) {
  const builder = new StringEnumValueMapperBuilder(comparer);
  for (const value of values) {
    builder.push(option(value));
  }
  return builder.build();
}

describe("StringEnumValueMapperBuilder", () => {
  it("maps primitive values to their string form", () => {
    const mapper = build("a", 1, true, null);
    expect(mapper.fromValue("a")).toBe("a");
    expect(mapper.fromValue(1)).toBe("1");
    expect(mapper.fromValue(true)).toBe("true");
    expect(mapper.fromValue(null)).toBe("null");
    expect(mapper.toValue("1")).toBe(1);
  });

  it("maps bigint and symbol values", () => {
    const sym = Symbol("sym");
    const mapper = build(1n, sym);
    expect(mapper.fromValue(1n as unknown as SchemaValue)).toBe("1");
    expect(mapper.fromValue(sym as unknown as SchemaValue)).toBe("Symbol(sym)");
    expect(mapper.toValue("1")).toBe(1n);
    expect(mapper.toValue("Symbol(sym)")).toBe(sym);
  });

  it("allows the same value to be pushed more than once", () => {
    const builder = new StringEnumValueMapperBuilder(comparer);
    builder.push(option("a"));
    expect(() => builder.push(option("a"))).not.toThrow();
  });

  it.each([
    ["number 1 beside string 1", 1, "1"],
    ["null beside string null", null, "null"],
    ["true beside string true", true, "true"],
    ["bigint 1 beside string 1", 1n, "1"],
  ])("rejects %s", (_, first, second) => {
    expect(() => build(first, second)).toThrow(
      /maps to ".*", which is already used by/
    );
  });

  it.each([
    ["array", [1]],
    ["object", { a: 1 }],
    ["function", () => 1],
  ])("rejects a non-primitive %s without serializing it", (_, value) => {
    expect(() => build(value)).toThrow(/not a primitive value/);
  });

  it("describes a cyclic object without JSON.stringify", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(() => build(cyclic)).not.toThrow(/circular/i);
    expect(() => build(cyclic)).toThrow(/not a primitive value/);
  });

  it("keeps the existing constructor error for non-primitive values", () => {
    expect(() => build([1])).toThrow(/Use 'IdEnumValueMapperBuilder'/);
  });
});
