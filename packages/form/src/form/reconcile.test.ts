import { describe, it, expect } from "vitest";

import {
  compareRecords,
  createSchemaValueComparator,
  isSchemaValueDeepEqual,
} from "#core/index.js";
import type { SchemaValue, ValueHandler } from "#core/index.js";
import { createTestContext } from "#core/testing.js";

import { FORM_KEYED_ARRAYS } from "./internals.js";
import { createFormValueReconciler } from "./reconcile.js";
import type { FormState } from "./state/index.js";

function testFormState(valueHandler: ValueHandler): FormState<unknown> {
  return {
    ...createTestContext({ valueHandler }),
    [FORM_KEYED_ARRAYS]: new WeakMap(),
  } as unknown as FormState<unknown>;
}

describe("", () => {
  const reconcile = createFormValueReconciler(
    testFormState({
      isValueDeepEqual: isSchemaValueDeepEqual,
    })
  );

  const byDate = createFormValueReconciler(
    testFormState({
      isValueDeepEqual: createSchemaValueComparator(compareRecords, (a, b) =>
        a instanceof Date && b instanceof Date
          ? a.getTime() === b.getTime()
          : Object.is(a, b)
      ),
    })
  );

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

  it("should replace a leaf the default valueHandler cannot match", () => {
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

  it("should keep a leaf a custom valueHandler declares equal", () => {
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
