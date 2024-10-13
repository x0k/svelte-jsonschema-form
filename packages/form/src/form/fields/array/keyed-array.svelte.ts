import type { SchemaArrayValue, SchemaValue } from "@/core/index.js";

export interface KeyedArray {
  key(index: number): number;
  push(value: SchemaValue | undefined): void;
  swap(a: number, b: number): void;
  insert(index: number, value: SchemaValue | undefined): void;
  remove(index: number): void;
}

const EMPTY: number[] = [];

export function createKeyedArray(
  array: () => SchemaArrayValue | undefined
): KeyedArray {
  let arrayRef: WeakRef<SchemaArrayValue> = new WeakRef(EMPTY);
  let lastKeys: number[] = EMPTY;
  let lastKey = -1;
  const keys = $derived.by(() => {
    const arr = array();
    if (arr === undefined || arrayRef.deref() === arr) {
      return lastKeys;
    }
    arrayRef = new WeakRef(arr);
    lastKeys = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      // NOTE: there is no `wrap-around` behavior
      // But i think `Infinity` is unreachable here
      lastKeys[i] = ++lastKey;
    }
    return lastKeys;
  });
  return {
    key(index: number) {
      return keys[index]!;
    },
    push(value) {
      lastKeys.push(++lastKey);
      array()?.push(value);
    },
    swap(a, b) {
      const arr = array();
      if (arr === undefined) {
        return;
      }
      const key = lastKeys[a];
      lastKeys[a] = lastKeys[b]!;
      lastKeys[b] = key!;
      const tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;
    },
    insert(index, value) {
      const arr = array();
      if (arr === undefined) {
        return;
      }
      lastKeys.splice(index, 0, ++lastKey);
      arr.splice(index, 0, value);
    },
    remove(index) {
      const arr = array();
      if (arr === undefined) {
        return;
      }
      lastKeys.splice(index, 1);
      arr.splice(index, 1);
    },
  };
}
