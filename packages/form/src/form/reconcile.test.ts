import { describe, it, expect } from "vitest";

import type { SchemaValue } from "#core/index.js";

import { createFormValueReconciler } from "./reconcile.js";

describe("", () => {
  const reconcile = createFormValueReconciler(new WeakMap());

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
});
