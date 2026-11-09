import { describe, expect, it } from "vitest";

import { copyForChange } from "./merger.js";
import type { FieldValue } from "./model.js";

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

  it("copies nested containers", () => {
    const value = { nested: { list: [1, 2] } };
    const copy = copyForChange(value) as typeof value;
    expect(copy).toEqual(value);
    expect(copy).not.toBe(value);
    expect(copy.nested).not.toBe(value.nested);
    expect(copy.nested.list).not.toBe(value.nested.list);
    copy.nested.list.push(3);
    expect(value.nested.list).toEqual([1, 2]);
  });

  it("delegates nested values to the provided copier", () => {
    const copy = (value: FieldValue): FieldValue =>
      typeof value === "number" ? value + 1 : copyForChange(value, copy);
    expect(copyForChange({ a: [1] }, copy)).toEqual({ a: [2] });
  });

  it("returns a File unchanged", () => {
    const file = new File(["x"], "x.txt");
    expect(copyForChange(file)).toBe(file);
  });

  it("returns a primitive unchanged", () => {
    expect(copyForChange("value")).toBe("value");
    expect(copyForChange(undefined)).toBeUndefined();
  });
});
