import { describe, expect, it, vi } from "vitest";

import { memoize } from "./memoize.js";

describe("memoize", () => {
  it("caches the computed value", () => {
    const fn = vi.fn((value: number) => value * 2);
    const memoized = memoize(new Map<number, number>(), fn);
    expect(memoized(2)).toBe(4);
    expect(memoized(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
