import { describe, expect, test } from "vitest";

import { chunks } from "./internal.js";

describe("chunks", () => {
  test("splits a string into parts that join back", () => {
    expect([...chunks("abcdefgh", 3)]).toEqual(["abc", "def", "gh"]);
  });

  // A 4-byte character cut in half becomes two lone surrogates, which the
  // transport re-encodes as U+FFFD — unrecoverable corruption.
  test("never splits a surrogate pair", () => {
    expect([...chunks("a🙂b", 2)]).toEqual(["a🙂", "b"]);
  });

  test("every size rejoins to the original around astral characters", () => {
    const payload = '{"b":"a🙂"}';
    for (let size = 1; size <= payload.length; size++) {
      expect([...chunks(payload, size)].join("")).toBe(payload);
    }
  });

  test("yields nothing for an empty string", () => {
    expect([...chunks("", 3)]).toEqual([]);
  });

  // `Math.ceil(len / 0)` is `Infinity`: without the guard the loop never ends.
  test.each([0, -1])("throws for a non-positive size (%i)", (size) => {
    expect(() => [...chunks("abc", size)]).toThrowError(
      "Chunk size must be positive"
    );
  });
});
