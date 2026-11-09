import { describe, expect, it, vi } from "vitest";

import { getOrInsertComputed } from "./map.js";

describe("getOrInsertComputed", () => {
  it("returns an existing value without calling create", () => {
    const map = new Map<string, number>([["a", 1]]);
    const create = vi.fn(() => 2);
    expect(getOrInsertComputed(map, "a", create)).toBe(1);
    expect(create).not.toHaveBeenCalled();
    expect(map.get("a")).toBe(1);
  });

  it("inserts and returns the computed value when the key is absent", () => {
    const map = new Map<string, number>();
    expect(getOrInsertComputed(map, "a", () => 1)).toBe(1);
    expect(map.get("a")).toBe(1);
  });

  it("passes the key to create", () => {
    const map = new Map<string, string>();
    expect(getOrInsertComputed(map, "a", (key) => key.toUpperCase())).toBe("A");
  });

  it("treats a stored undefined value as present", () => {
    const map = new Map<string, number | undefined>([["a", undefined]]);
    const create = vi.fn(() => 1);
    expect(getOrInsertComputed(map, "a", create)).toBe(undefined);
    expect(create).not.toHaveBeenCalled();
  });
});
