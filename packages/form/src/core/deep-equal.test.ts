import { describe, expect, it } from "vitest";

import {
  compareOrderedRecords,
  compareRecords,
  createSchemaValueComparator,
  isOrderedSchemaDeepEqual,
  isSchemaDeepEqual,
  isSchemaValueDeepEqual,
} from "./deep-equal.js";
import type { Schema, SchemaValue } from "./schema.js";

describe("isSchemaDeepEqual", () => {
  it.each([[isSchemaDeepEqual], [isOrderedSchemaDeepEqual]])(
    "should compare correctly simple schema",
    (compare) => {
      const schema: Schema = {
        type: "object",
        properties: {
          foo: {
            type: "string",
          },
        },
      };
      expect(compare(schema, structuredClone(schema))).toBe(true);
    }
  );
  it.each([
    [isSchemaDeepEqual, true],
    [isOrderedSchemaDeepEqual, false],
  ])(
    "should compare correctly simple schemas with different order in records",
    (compare, expected) => {
      const schema1: Schema = {
        type: "object",
        properties: {
          foo: {
            type: "string",
          },
          bar: {
            type: "number",
          },
        },
      };
      const schema2: Schema = {
        type: "object",
        properties: {
          bar: {
            type: "number",
          },
          foo: {
            type: "string",
          },
        },
      };
      expect(compare(schema1, schema2)).toBe(expected);
    }
  );
  it.each([
    [isSchemaDeepEqual, true],
    [isOrderedSchemaDeepEqual, false],
  ])(
    "should compare correctly simple schemas with different order in array items",
    (compare, expected) => {
      const schema1: Schema = {
        type: "array",
        items: [
          {
            type: "object",
            properties: {
              foo: {
                type: "string",
              },
              bar: {
                type: "number",
              },
            },
          },
        ],
      };
      const schema2: Schema = {
        type: "array",
        items: [
          {
            type: "object",
            properties: {
              bar: {
                type: "number",
              },
              foo: {
                type: "string",
              },
            },
          },
        ],
      };
      expect(compare(schema1, schema2)).toBe(expected);
    }
  );
});

describe("isSchemaValueDeepEqual", () => {
  it("should treat NaN as equal to itself", () => {
    expect(isSchemaValueDeepEqual(NaN, NaN)).toBe(true);
  });

  // `SchemaValue` is JSON only, so these values have to be asserted through
  // even though the runtime accepts them
  const asValue = (v: unknown) => v as SchemaValue;

  it("should not traverse values that are not plain records or arrays", () => {
    expect(
      isSchemaValueDeepEqual(asValue(new Date(0)), asValue(new Date(0)))
    ).toBe(false);
    expect(
      isSchemaValueDeepEqual(
        asValue(new Map([["a", 1]])),
        asValue(new Map([["a", 1]]))
      )
    ).toBe(false);
  });

  it("should report an array paired with a non-array object unequal in either order", () => {
    expect(isSchemaValueDeepEqual(asValue([1]), asValue(new Date(0)))).toBe(
      false
    );
    expect(isSchemaValueDeepEqual(asValue(new Date(0)), asValue([1]))).toBe(
      false
    );
  });
});

describe("createSchemaValueComparator", () => {
  const asValue = (v: unknown) => v as SchemaValue;

  const byDate = createSchemaValueComparator(compareRecords, (a, b) =>
    a instanceof Date && b instanceof Date
      ? a.getTime() === b.getTime()
      : Object.is(a, b)
  );

  it("should compare leaves with the provided function", () => {
    expect(byDate(asValue(new Date(10)), asValue(new Date(10)))).toBe(true);
    expect(byDate(asValue(new Date(10)), asValue(new Date(20)))).toBe(false);
  });

  it("should apply the provided function at every depth", () => {
    expect(
      byDate({ when: asValue(new Date(0)) }, { when: asValue(new Date(0)) })
    ).toBe(true);
    expect(
      byDate({ when: asValue(new Date(0)) }, { when: asValue(new Date(1)) })
    ).toBe(false);
  });

  it("should still traverse records and arrays", () => {
    expect(
      byDate({ a: [asValue(new Date(0))] }, { a: [asValue(new Date(0))] })
    ).toBe(true);
    expect(
      byDate({ a: [asValue(new Date(0))] }, { a: [asValue(new Date(1))] })
    ).toBe(false);
    expect(byDate({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("should take the record comparison strategy from the first argument", () => {
    const orderedByDate = createSchemaValueComparator(
      compareOrderedRecords,
      (a, b) =>
        a instanceof Date && b instanceof Date
          ? a.getTime() === b.getTime()
          : Object.is(a, b)
    );
    expect(orderedByDate({ x: 1, y: 2 }, { y: 2, x: 1 })).toBe(false);
    expect(byDate({ x: 1, y: 2 }, { y: 2, x: 1 })).toBe(true);
  });

  it("should report an array paired with a non-array object unequal in either order", () => {
    // A leaf rule that accepts everything, so that only the pair itself can
    // report the values unequal
    const always = createSchemaValueComparator(compareRecords, () => true);
    expect(always(asValue([1]), asValue(new Date(0)))).toBe(false);
    expect(always(asValue(new Date(0)), asValue([1]))).toBe(false);
    expect(always(asValue([1]), asValue({ 0: 1 }))).toBe(false);
    expect(always(asValue({ 0: 1 }), asValue([1]))).toBe(false);
    expect(always({ a: asValue([1]) }, { a: asValue(new Date(0)) })).toBe(
      false
    );
    expect(always({ a: asValue(new Date(0)) }, { a: asValue([1]) })).toBe(
      false
    );
  });

  it("should delegate a non-array object paired with a plain record to the provided function", () => {
    const seen: unknown[][] = [];
    const compare = createSchemaValueComparator(compareRecords, (a, b) => {
      seen.push([a, b]);
      return true;
    });
    expect(compare(asValue(new Date(0)), { a: 1 })).toBe(true);
    expect(compare({ a: 1 }, asValue(new Date(0)))).toBe(true);
    expect(seen).toEqual([
      [new Date(0), { a: 1 }],
      [{ a: 1 }, new Date(0)],
    ]);
  });
});
