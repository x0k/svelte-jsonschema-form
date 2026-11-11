import { describe, expect, test } from "vitest";

import type { Schema } from "#core/index.js";

import {
  collectHeldKeys,
  stableKeyOf,
  withRenamedKey,
  withoutRenamedKey,
} from "./model.js";

function properties(...names: string[]) {
  return Object.fromEntries(names.map((name) => [name, true])) as Exclude<
    Schema["properties"],
    undefined
  >;
}

function heldKeys(
  renamedKeys: ReadonlyMap<string, string>,
  ...names: string[]
) {
  return collectHeldKeys(renamedKeys, properties(...names));
}

describe("collectHeldKeys", () => {
  test("holds only the keys of renamed properties that are rendered", () => {
    const renamedKeys = new Map([
      ["renamed", "start"],
      ["gone", "other"],
    ]);
    expect([...heldKeys(renamedKeys, "renamed")]).toEqual(["start"]);
  });
});

describe("stableKeyOf", () => {
  test("uses the property name when nothing was renamed", () => {
    const renamedKeys = new Map<string, string>();
    expect(stableKeyOf(renamedKeys, "foo", heldKeys(renamedKeys, "foo"))).toBe(
      "foo"
    );
  });

  test("uses the key a renamed property took with it", () => {
    const renamedKeys = new Map([["renamed", "start"]]);
    expect(
      stableKeyOf(renamedKeys, "renamed", heldKeys(renamedKeys, "renamed"))
    ).toBe("start");
  });

  test("gives a property whose name a renamed property holds a variant", () => {
    const renamedKeys = new Map([["renamed", "start"]]);
    expect(
      stableKeyOf(
        renamedKeys,
        "start",
        heldKeys(renamedKeys, "renamed", "start")
      )
    ).toBe("start\0");
  });

  test("does not hold the key of a renamed property that is no longer rendered", () => {
    const renamedKeys = new Map([["renamed", "start"]]);
    expect(
      stableKeyOf(renamedKeys, "start", heldKeys(renamedKeys, "start"))
    ).toBe("start");
  });

  test("skips every held variant", () => {
    const renamedKeys = new Map([
      ["first", "start"],
      ["second", "start\0"],
    ]);
    expect(
      stableKeyOf(
        renamedKeys,
        "start",
        heldKeys(renamedKeys, "first", "second", "start")
      )
    ).toBe("start\0\0");
  });
});

describe("withRenamedKey", () => {
  test("keeps the key every renamed property rendered under", () => {
    const renamedKeys = withRenamedKey(
      new Map(),
      "start",
      "renamed",
      heldKeys(new Map(), "start", "renamed")
    );
    expect(renamedKeys).toEqual(new Map([["renamed", "start"]]));

    expect(
      withRenamedKey(
        renamedKeys,
        "other",
        "other2",
        heldKeys(renamedKeys, "renamed", "other", "other2")
      )
    ).toEqual(
      new Map([
        ["renamed", "start"],
        ["other2", "other"],
      ])
    );
  });

  test("keeps the variant of a property renamed after another took its name", () => {
    const renamedKeys = new Map([["renamed", "start"]]);
    expect(
      withRenamedKey(
        renamedKeys,
        "start",
        "third",
        heldKeys(renamedKeys, "renamed", "start", "third")
      )
    ).toEqual(
      new Map([
        ["renamed", "start"],
        ["third", "start\0"],
      ])
    );
  });
});

describe("withoutRenamedKey", () => {
  test("returns the same map when the removed property was not renamed", () => {
    const renamedKeys = new Map([["renamed", "start"]]);
    expect(
      withoutRenamedKey(renamedKeys, "other", properties("renamed", "other"))
    ).toBe(renamedKeys);
  });

  test("forgets the removed property", () => {
    expect(
      withoutRenamedKey(
        new Map([["renamed", "start"]]),
        "renamed",
        properties("renamed")
      )
    ).toEqual(new Map());
  });

  test("pins a property whose key would fall back to its name", () => {
    const renamedKeys = new Map([
      ["first", "newKey"],
      ["second", "newKey\0"],
    ]);
    expect(
      withoutRenamedKey(
        renamedKeys,
        "first",
        properties("first", "second", "newKey")
      )
    ).toEqual(
      new Map([
        ["second", "newKey\0"],
        ["newKey", "newKey\0\0"],
      ])
    );
  });
});
