import { describe, expect, test } from "vitest";

import { FORM_KEYED_ARRAYS } from "../internals.js";
import type { KeyedFieldValues } from "../model.js";
import { createKeyedArrayDeriver } from "./array.js";
import type { FormState } from "./state.js";

function createCtx() {
  return {
    [FORM_KEYED_ARRAYS]: new WeakMap(),
  } as unknown as FormState<unknown>;
}

describe("createKeyedArrayDeriver", () => {
  test.each(["one", 0, null, undefined, {}])(
    "uses a virtual array for the non-array value %j",
    (value) => {
      const virtual = {} as KeyedFieldValues;
      const deriver = createKeyedArrayDeriver(
        createCtx(),
        () => value as never,
        () => virtual,
        () => {
          throw new Error("keyed array factory must not run");
        }
      );

      expect(deriver()).toBe(virtual);
    }
  );

  test("caches a keyed array for an array value", () => {
    const keyed = {} as KeyedFieldValues;
    const array: never[] = [];
    const ctx = createCtx();
    const deriver = createKeyedArrayDeriver(
      ctx,
      () => array,
      () => {
        throw new Error("virtual array factory must not run");
      },
      () => keyed
    );

    expect(deriver()).toBe(keyed);
    expect(deriver()).toBe(keyed);
    expect(ctx[FORM_KEYED_ARRAYS].get(array)).toBe(keyed);
  });
});
