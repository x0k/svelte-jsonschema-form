import { describe, it, expect } from "vitest";

import {
  compareRecords,
  createSchemaValueComparator,
  isSchemaValueDeepEqual,
} from "#core/index.js";
import type { SchemaValue } from "#core/index.js";

import { createFormValueReconciler } from "./reconcile.js";

describe("", () => {
  const reconcile = createFormValueReconciler({
    keyedArraysMap: new WeakMap(),
    valueComparer: {
      isValueDeepEqual: isSchemaValueDeepEqual,
    },
  });

  const byDate = createFormValueReconciler({
    keyedArraysMap: new WeakMap(),
    valueComparer: {
      isValueDeepEqual: createSchemaValueComparator(compareRecords, (a, b) =>
        a instanceof Date && b instanceof Date
          ? a.getTime() === b.getTime()
          : Object.is(a, b)
      ),
    },
  });

  it("should preserve undefined values", () => {
    let value = {
      foo: "123",
    };
    reconcile(
      {
        get current() {
          return value;
        },
        set current(v) {
          value = v;
        },
      },
      {
        bar: undefined,
      }
    );
    expect(value).toEqual({ bar: undefined });
  });

  it("should reconcile an own __proto__ key without changing the prototype", () => {
    let value = {};
    reconcile(
      {
        get current() {
          return value as SchemaValue;
        },
        set current(v) {
          value = v as Record<string, never>;
        },
      },
      JSON.parse('{"__proto__":{"a":1}}')
    );
    expect(Object.hasOwn(value, "__proto__")).toBe(true);
    expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
    expect((value as Record<string, unknown>)["__proto__"]).toEqual({ a: 1 });
  });

  it("should replace a leaf the default comparator cannot match", () => {
    const targetDate = new Date(0);
    const sourceDate = new Date(0);
    const target = { d: targetDate } as unknown as SchemaValue;
    let value: unknown = target;
    reconcile(
      {
        get current() {
          return value as SchemaValue;
        },
        set current(v) {
          value = v;
        },
      },
      { d: sourceDate } as unknown as SchemaValue
    );
    expect((value as { d: Date }).d).toBe(sourceDate);
  });

  it("should keep a leaf a custom comparator declares equal", () => {
    const targetDate = new Date(0);
    const sourceDate = new Date(0);
    const target = { d: targetDate } as unknown as SchemaValue;
    let value: unknown = target;
    byDate(
      {
        get current() {
          return value as SchemaValue;
        },
        set current(v) {
          value = v;
        },
      },
      { d: sourceDate } as unknown as SchemaValue
    );
    expect((value as { d: Date }).d).toBe(targetDate);
  });
});
