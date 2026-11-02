import { describe, expect, it } from "vitest";

import { copyForChange, getValueAtPath } from "./change-path.js";
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
