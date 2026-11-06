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
});
