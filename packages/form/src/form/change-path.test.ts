import { describe, expect, it } from "vitest";

import {
  copyForChange,
  getValueAtPath,
  updateValueAtPath,
  writeValueAtPath,
} from "./change-path.js";
import type { FieldPath } from "./id.js";
import type { FormValue } from "./model.js";

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

  it("does not read array length", () => {
    expect(getValueAtPath([1, 2, 3], path("length"))).toBeUndefined();
    expect(() => getValueAtPath([1, 2, 3], path("length", "x"))).toThrow(
      'Path "[length, x]" is not populated'
    );
  });

  it("does not read custom array properties", () => {
    const value = [1, 2] as number[] & { custom?: number };
    value.custom = 3;
    expect(getValueAtPath(value, path("custom"))).toBeUndefined();
    expect(() => getValueAtPath(value, path("custom", "x"))).toThrow(
      'Path "[custom, x]" is not populated'
    );
  });

  it("returns undefined for an out-of-bounds index", () => {
    expect(getValueAtPath([1], path(5))).toBeUndefined();
    expect(() => getValueAtPath([1], path(5, "x"))).toThrow(
      'Path "[5, x]" is not populated'
    );
  });

  it("rejects non-integer array indices", () => {
    expect(getValueAtPath([1, 2], path(1.5))).toBeUndefined();
    expect(() => getValueAtPath([1, 2], path(1.5, "x"))).toThrow(
      'Path "[1.5, x]" is not populated'
    );
  });

  it("rejects string keys on arrays", () => {
    expect(getValueAtPath([1, 2], path("0"))).toBeUndefined();
    expect(() => getValueAtPath([1, 2], path("0", "x"))).toThrow(
      'Path "[0, x]" is not populated'
    );
  });

  it("throws when the path goes through a non-plain object", () => {
    class Box {
      own = 1;
    }
    expect(() =>
      getValueAtPath(new Box() as unknown as FormValue, path("own", "x"))
    ).toThrow('Path "[own, x]" is not populated');
  });

  it("returns a non-plain object at the leaf", () => {
    class Box {
      own = 1;
    }
    const box = new Box();
    expect(getValueAtPath({ box } as unknown as FormValue, path("box"))).toBe(
      box
    );
  });

  it("reads an own property of a null-prototype object", () => {
    const value = Object.assign(Object.create(null), { a: 1 });
    expect(getValueAtPath(value, path("a"))).toBe(1);
  });
});

describe("writeValueAtPath", () => {
  it("returns the value for an empty path", () => {
    const value = { a: 1 };
    expect(writeValueAtPath({ b: 2 }, path(), value)).toBe(value);
  });

  it("writes a nested value and returns the root", () => {
    const root = { a: [{ b: 1 }] };
    expect(writeValueAtPath(root, path("a", 0, "b"), 2)).toBe(root);
    expect(root.a[0]!.b).toBe(2);
  });

  it("writes an array item", () => {
    const root = [1, 2];
    writeValueAtPath(root, path(1), 3);
    expect(root).toEqual([1, 3]);
  });

  it("writes __proto__ as an own property", () => {
    const root = {};
    writeValueAtPath(root, path("__proto__"), { polluted: true });
    expect(Object.hasOwn(root, "__proto__")).toBe(true);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it("rejects a string array index", () => {
    const root = [1, 2];
    expect(() => writeValueAtPath(root, path("0"), 3)).toThrow(
      'Path "[0]" is not populated'
    );
    expect(root).toEqual([1, 2]);
  });

  it("rejects an out-of-bounds array index", () => {
    const root = [1, 2];
    expect(() => writeValueAtPath(root, path(2), 3)).toThrow(
      'Path "[2]" is not populated'
    );
    expect(root).toEqual([1, 2]);
  });

  it("throws when the path goes through a non-plain object", () => {
    class Box {
      own = 1;
    }
    const box = new Box();
    expect(() =>
      writeValueAtPath({ box } as unknown as FormValue, path("box", "own"), 2)
    ).toThrow('Path "[box, own]" is not populated');
    expect(box.own).toBe(1);
  });

  it("throws when an intermediate path is missing", () => {
    expect(() => writeValueAtPath({}, path("missing", "child"), 1)).toThrow(
      'Path "[missing, child]" is not populated'
    );
  });
});

describe("updateValueAtPath", () => {
  it("updates the root for an empty path", () => {
    expect(updateValueAtPath({ a: 1 }, path(), () => ({ b: 2 }))).toEqual({
      b: 2,
    });
  });

  it("updates a nested value and returns the root", () => {
    const root = { a: [{ b: 1 }] };
    expect(
      updateValueAtPath(
        root,
        path("a", 0, "b"),
        (value) => (value as number) + 1
      )
    ).toBe(root);
    expect(root.a[0]!.b).toBe(2);
  });

  it("does not write when the update returns the same value", () => {
    const root = { a: { b: 1 } };
    updateValueAtPath(root, path("a", "b"), (value) => value);
    expect(root.a.b).toBe(1);
  });

  it("updates an array item", () => {
    const root = [1, 2];
    updateValueAtPath(root, path(1), () => 3);
    expect(root).toEqual([1, 3]);
  });

  it("throws when the path goes through a primitive", () => {
    expect(() => updateValueAtPath({ a: 1 }, path("a", "b"), () => 2)).toThrow(
      'Path "[a, b]" is not populated'
    );
  });

  it("rejects a string array index", () => {
    const root = ["a", "b"];
    let called = false;
    expect(() =>
      updateValueAtPath(root, path("0"), () => {
        called = true;
        return "c";
      })
    ).toThrow('Path "[0]" is not populated');
    expect(called).toBe(false);
    expect(root).toEqual(["a", "b"]);
  });

  it("rejects an out-of-bounds array index", () => {
    const root = ["a"];
    expect(() => updateValueAtPath(root, path(1), () => "b")).toThrow(
      'Path "[1]" is not populated'
    );
    expect(root).toEqual(["a"]);
  });
});
