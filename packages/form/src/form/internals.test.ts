import { describe, expect, test } from "vitest";

import type { FieldPath } from "./id.js";
import { internalRegisterFieldPath } from "./internals.js";
import type { RegisteredPathTrieRef } from "./model.js";

describe("internalRegisterFieldPath", () => {
  test("returns a registered FieldPath without reading the trie", () => {
    const path = ["a", 0] as unknown as FieldPath;
    const ref = {
      registered: new WeakSet([path]),
      get current(): never {
        throw new Error("trie lookup");
      },
    } as unknown as RegisteredPathTrieRef<FieldPath>;

    expect(internalRegisterFieldPath(ref, path)).toBe(path);
  });

  test("returns the canonical FieldPath for an equal RPath", () => {
    const ref: RegisteredPathTrieRef<FieldPath> = {
      current: undefined,
      registered: new WeakSet(),
    };

    const first = internalRegisterFieldPath(ref, ["a", 0]);
    const second = internalRegisterFieldPath(ref, ["a", 0]);

    expect(second).toBe(first);
    expect(ref.registered.has(first)).toBe(true);
  });

  test("does not keep a caller-owned path as the canonical value", () => {
    const ref: RegisteredPathTrieRef<FieldPath> = {
      current: undefined,
      registered: new WeakSet(),
    };
    const input = ["a", 0];

    const canonical = internalRegisterFieldPath(ref, input);
    input[0] = "b";

    expect(canonical).not.toBe(input);
    expect(internalRegisterFieldPath(ref, ["a", 0])).toBe(canonical);
    expect(internalRegisterFieldPath(ref, ["b", 0])).not.toBe(canonical);
  });
});
