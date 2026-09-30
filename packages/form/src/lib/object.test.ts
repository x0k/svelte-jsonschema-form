import { describe, expect, it } from "vitest";

import { getValueByPath } from "./object.js";

describe("getValueByPath", () => {
  it("reads an own property", () => {
    expect(getValueByPath({ a: 1 }, ["a"])).toBe(1);
  });
  it("walks nested own properties", () => {
    expect(getValueByPath({ a: { b: { c: "deep" } } }, ["a", "b", "c"])).toBe(
      "deep"
    );
  });
  it("reads an own property that is undefined", () => {
    expect(getValueByPath({ a: undefined }, ["a"], "fallback")).toBe(undefined);
  });
  it("returns the source for an empty path", () => {
    const source = { a: 1 };
    expect(getValueByPath(source, [])).toBe(source);
  });
  it("reads an array element by a numeric index", () => {
    expect(getValueByPath({ a: ["x", "y"] }, ["a", 1])).toBe("y");
  });
  it("returns the default value for an out of range array index", () => {
    expect(getValueByPath({ a: ["x"] }, ["a", 5], "fallback")).toBe("fallback");
  });
  it("returns the default value for a missing key", () => {
    expect(getValueByPath({ a: 1 }, ["b"], "fallback")).toBe("fallback");
  });
  it("returns the default value when the path runs through a primitive", () => {
    expect(getValueByPath({ a: 1 }, ["a", "b"], "fallback")).toBe("fallback");
  });
  it("reads own properties of an object with a null prototype", () => {
    const source = Object.assign(
      Object.create(null) as Record<string, unknown>,
      {
        a: 1,
      }
    );
    expect(getValueByPath(source, ["a"])).toBe(1);
  });

  describe("own properties only", () => {
    it.each([
      ["toString"],
      ["constructor"],
      ["valueOf"],
      ["hasOwnProperty"],
      ["isPrototypeOf"],
      ["__proto__"],
    ])("does not read the inherited %s", (key) => {
      expect(getValueByPath({ a: 1 }, [key], "fallback")).toBe("fallback");
    });
    it("reads an own property that shadows an inherited member", () => {
      expect(getValueByPath({ toString: "own" }, ["toString"])).toBe("own");
    });
    it("resolves nothing through an object that has a non-plain prototype", () => {
      // `isRecord()` accepts only `Object.prototype` and null-prototype
      // objects, so a class instance contributes nothing, own properties
      // included. Pre-existing behaviour, unrelated to the own-property rule.
      const instance = new (class {
        own = "instance";
      })();
      expect(getValueByPath(instance, ["own"], "fallback")).toBe("fallback");
    });
    it("does not reach a nested prototype from a plain object", () => {
      expect(
        getValueByPath({ a: {} }, ["a", "constructor", "prototype"], "fallback")
      ).toBe("fallback");
    });
  });
});
