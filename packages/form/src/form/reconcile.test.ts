import { describe, it, expect } from "vitest";

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
});
