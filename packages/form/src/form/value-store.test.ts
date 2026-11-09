import { describe, expect, test } from "vitest";

import type { FieldPath } from "./id.js";
import { copyForChange, type FormValueChange } from "./merger.js";
import type { FieldValue, FormValue } from "./model.js";
import { createFormValueStore } from "./value-store.js";

function path(...parts: (string | number)[]) {
  return parts as unknown as FieldPath;
}

function createStore(
  initialValue: FormValue,
  onChange: (change: FormValueChange) => void = () => {},
  copy: (value: FieldValue) => FieldValue = copyForChange
) {
  let value = initialValue;
  return createFormValueStore({
    valueRef: {
      get current() {
        return value;
      },
      set current(v) {
        value = v;
      },
    },
    keyedArrays: new WeakMap(),
    copyForChange: copy,
    onChange,
    onReplace() {},
  });
}

describe("createFormValueStore", () => {
  test("setAtPath keeps the root identity for non-root writes", () => {
    const initial = { a: 1, nested: { b: 2 } };
    const store = createStore(initial);

    store.setAtPath(path("nested", "b"), 3);

    expect(store.get()).toBe(initial);
    expect(store.get()).toEqual({ a: 1, nested: { b: 3 } });
  });

  test("setAtPath replaces the root for an empty path", () => {
    const initial = { a: 1 };
    const next = { b: 2 };
    const store = createStore(initial);

    store.setAtPath(path(), next);

    expect(store.get()).toBe(next);
  });

  test("setAtPath does not record a no-op write", () => {
    const changes: FormValueChange[] = [];
    const initial = { a: 1 };
    const store = createStore(initial, (change) => changes.push(change));

    store.setAtPath(path("a"), 1);

    expect(changes).toEqual([]);
    expect(store.get()).toBe(initial);
  });

  test("updateAtPath records nested values before an in-place mutation", () => {
    const changes: FormValueChange[] = [];
    const initial = { wrapper: { config: { mode: "a" } } };
    const store = createStore(initial, (change) => changes.push(change));

    store.updateAtPath(path("wrapper"), (wrapper) => {
      const value = wrapper as { config: { mode: string } };
      value.config.mode = "b";
      return wrapper;
    });

    expect(changes).toEqual([
      { path: path("wrapper"), oldValue: { config: { mode: "a" } } },
    ]);
    expect(store.get()).toEqual({ wrapper: { config: { mode: "b" } } });
  });

  test("updateAtPath copies containers below the updated path", () => {
    const changes: FormValueChange[] = [];
    const initial = { wrapper: { list: [{ value: 1 }] } };
    const store = createStore(initial, (change) => changes.push(change));

    store.updateAtPath(path("wrapper"), (wrapper) => {
      const value = wrapper as { list: { value: number }[] };
      value.list[0]!.value = 2;
      value.list.push({ value: 3 });
      return wrapper;
    });

    expect(changes).toEqual([
      { path: path("wrapper"), oldValue: { list: [{ value: 1 }] } },
    ]);
    expect(store.get()).toEqual({
      wrapper: { list: [{ value: 2 }, { value: 3 }] },
    });
  });

  test("updateAtPath uses the configured copyForChange", () => {
    const changes: FormValueChange[] = [];
    const initial = {
      wrapper: { map: new Map([["a", 1]]) },
    } as unknown as FormValue;
    const copy = (value: FieldValue): FieldValue =>
      value instanceof Map
        ? (new Map(value) as unknown as FieldValue)
        : copyForChange(value, copy);
    const store = createStore(initial, (change) => changes.push(change), copy);

    store.updateAtPath(path("wrapper"), (wrapper) => {
      const value = wrapper as unknown as { map: Map<string, number> };
      value.map.set("a", 2);
      return wrapper;
    });

    const oldValue = changes[0]!.oldValue as unknown as {
      map: Map<string, number>;
    };
    expect(oldValue.map).toEqual(new Map([["a", 1]]));
    expect(oldValue.map).not.toBe(
      (initial as unknown as { wrapper: { map: Map<string, number> } }).wrapper
        .map
    );
    expect(store.get()).toEqual({
      wrapper: { map: new Map([["a", 2]]) },
    });
  });

  test("updateAtPath keeps the root identity", () => {
    const initial = { nested: { b: 2 } };
    const store = createStore(initial);

    store.updateAtPath(path("nested"), (nested) => {
      (nested as { b: number }).b = 3;
      return nested;
    });

    expect(store.get()).toBe(initial);
    expect(store.get()).toEqual({ nested: { b: 3 } });
  });

  test("updateArrayAtPath ignores a no-op command", () => {
    const changes: FormValueChange[] = [];
    const initial = { list: [1, 2] };
    const store = createStore(initial, (change) => changes.push(change));

    store.updateArrayAtPath(path("list"), () => {});

    expect(changes).toEqual([]);
    expect(store.get()).toBe(initial);
  });

  test("updateArrayAtPath records the array before a structural change", () => {
    const changes: FormValueChange[] = [];
    const initial = { list: [1, 2] };
    const store = createStore(initial, (change) => changes.push(change));

    store.updateArrayAtPath(path("list"), (array, length) => {
      expect(length).toBe(2);
      array.push(3);
    });

    expect(changes).toEqual([{ path: path("list"), oldValue: [1, 2] }]);
    expect(store.get()).toEqual({ list: [1, 2, 3] });
  });

  test("setAtPath does not record a change when the write throws", () => {
    const changes: FormValueChange[] = [];
    const initial = { list: ["a"] };
    const store = createStore(initial, (change) => changes.push(change));

    expect(() => store.setAtPath(path("list", 1), "b")).toThrow();

    expect(changes).toEqual([]);
    expect(store.get()).toBe(initial);
  });

  test("updateAtPath does not record a change when the update throws", () => {
    const changes: FormValueChange[] = [];
    const initial = { list: [1] };
    const store = createStore(initial, (change) => changes.push(change));

    expect(() =>
      store.updateAtPath(path("list"), () => {
        throw new Error("update failed");
      })
    ).toThrow("update failed");

    expect(changes).toEqual([]);
    expect(store.get()).toBe(initial);
  });

  test("updateArrayAtPath does not record a change when the write throws", () => {
    const changes: FormValueChange[] = [];
    const initial = { list: [] as string[] };
    const store = createStore(initial, (change) => changes.push(change));

    expect(() =>
      store.updateArrayAtPath(path("list", "0"), (array) => {
        array.push("a");
      })
    ).toThrow();

    expect(changes).toEqual([]);
    expect(store.get()).toBe(initial);
  });
});
