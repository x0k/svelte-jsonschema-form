import { describe, expect, it } from "vitest";

import { isSchemaValueDeepEqual } from "#core/index.js";

import {
  collectValueChanges,
  copyForChange,
  getValueAtPath,
  snapshotFormValue,
} from "./change-path.js";
import type { FieldPath } from "./id.js";

function path(...parts: (string | number)[]) {
  return parts as unknown as FieldPath;
}

describe("copyForChange", () => {
  it("copies an array", () => {
    const value = [1, 2];
    const copy = copyForChange(value) as number[];
    expect(copy).toEqual(value);
    expect(copy).not.toBe(value);
    copy.push(3);
    expect(value).toEqual([1, 2]);
  });

  it("copies an object", () => {
    const value = { a: 1 };
    const copy = copyForChange(value) as { a?: number };
    expect(copy).toEqual(value);
    expect(copy).not.toBe(value);
    delete copy.a;
    expect(value).toEqual({ a: 1 });
  });

  it("returns a primitive unchanged", () => {
    expect(copyForChange("value")).toBe("value");
    expect(copyForChange(undefined)).toBeUndefined();
  });
});

describe("getValueAtPath", () => {
  it("returns the root for an empty path", () => {
    const value = { a: 1 };
    expect(getValueAtPath(value, path())).toBe(value);
  });

  it("reads a nested value", () => {
    expect(getValueAtPath({ a: [{ b: 1 }] }, path("a", 0, "b"))).toBe(1);
  });

  it("returns undefined for a missing key", () => {
    expect(getValueAtPath({}, path("missing"))).toBeUndefined();
  });

  it("does not read inherited properties", () => {
    expect(getValueAtPath({}, path("toString"))).toBeUndefined();
    expect(getValueAtPath({}, path("constructor"))).toBeUndefined();
    expect(getValueAtPath({}, path("__proto__"))).toBeUndefined();
  });

  it("throws when the path goes through a primitive", () => {
    expect(() => getValueAtPath({ a: 1 }, path("a", "b"))).toThrow(
      'Path "[a, b]" is not populated'
    );
  });
});

describe("snapshotFormValue", () => {
  it("copies nested arrays and records", () => {
    const value = { a: [{ b: 1 }] };
    const snapshot = snapshotFormValue(value);
    expect(snapshot).toEqual(value);
    expect(snapshot).not.toBe(value);
    expect((snapshot as typeof value).a).not.toBe(value.a);
    expect((snapshot as typeof value).a[0]).not.toBe(value.a[0]);
  });

  it("preserves prototype-named keys", () => {
    const value = JSON.parse('{"__proto__":{"a":1}}');
    const snapshot = snapshotFormValue(value) as Record<string, unknown>;
    expect(Object.hasOwn(snapshot, "__proto__")).toBe(true);
    expect(Object.getPrototypeOf(snapshot)).toBe(Object.prototype);
    expect(snapshot["__proto__"]).toEqual({ a: 1 });
  });

  it("returns non-plain values unchanged", () => {
    const date = new Date(0);
    expect(snapshotFormValue(date as never)).toBe(date);
  });
});

describe("collectValueChanges", () => {
  function changes(oldValue: unknown, newValue: unknown) {
    return collectValueChanges(
      isSchemaValueDeepEqual,
      oldValue as never,
      newValue as never
    );
  }

  it("returns nothing for equal values", () => {
    expect(changes({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toEqual([]);
  });

  it("records a replaced leaf", () => {
    expect(changes({ a: 1 }, { a: 2 })).toEqual([
      { path: path("a"), oldValue: 1 },
    ]);
  });

  it("records a nested leaf", () => {
    expect(changes({ a: { b: 1 } }, { a: { b: 2 } })).toEqual([
      { path: path("a", "b"), oldValue: 1 },
    ]);
  });

  it("records an added key with an undefined old value", () => {
    expect(changes({}, { a: 1 })).toEqual([
      { path: path("a"), oldValue: undefined },
    ]);
  });

  it("records a removed key", () => {
    expect(changes({ a: 1 }, {})).toEqual([{ path: path("a"), oldValue: 1 }]);
  });

  it("records a replaced array item", () => {
    expect(changes({ a: [1, 2] }, { a: [1, 3] })).toEqual([
      { path: path("a", 1), oldValue: 2 },
    ]);
  });

  it("records the whole array after a length change", () => {
    expect(changes({ a: [1, 2] }, { a: [1, 2, 3] })).toEqual([
      { path: path("a"), oldValue: [1, 2] },
    ]);
  });

  it("records a container whose type changed", () => {
    expect(changes({ a: { b: 1 } }, { a: [1] })).toEqual([
      { path: path("a"), oldValue: { b: 1 } },
    ]);
  });

  it("records a root replacement", () => {
    expect(changes({ a: 1 }, [1])).toEqual([
      { path: path(), oldValue: { a: 1 } },
    ]);
  });

  it("reads prototype-named keys as own properties", () => {
    const oldValue = JSON.parse('{"__proto__":{"a":1}}');
    const newValue = JSON.parse('{"__proto__":{"a":2}}');
    expect(changes(oldValue, newValue)).toEqual([
      { path: path("__proto__", "a"), oldValue: 1 },
    ]);
  });
});
