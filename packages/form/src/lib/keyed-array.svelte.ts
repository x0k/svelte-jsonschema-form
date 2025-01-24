export interface KeyedArray<T> {
  key(index: number): number;
  push(value: T): void;
  swap(a: number, b: number): void;
  insert(index: number, value: T): void;
  remove(index: number): void;
}

const EMPTY: any[] = [];

export function createKeyedArray<T>(
  array: () => T[]
): KeyedArray<T> {
  let arrayRef: WeakRef<T[]> = new WeakRef(EMPTY);
  let lastKeys: number[] = EMPTY;
  let lastKey = -1;
  const keys = $derived.by(() => {
    const arr = array();
    if (arrayRef.deref() === arr) {
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
      array().push(value);
    },
    swap(a, b) {
      const arr = array();
      const key = lastKeys[a];
      lastKeys[a] = lastKeys[b]!;
      lastKeys[b] = key!;
      const tmp = arr[a]!;
      arr[a] = arr[b]!;
      arr[b] = tmp;
    },
    insert(index, value) {
      lastKeys.splice(index, 0, ++lastKey);
      array().splice(index, 0, value);
    },
    remove(index) {
      lastKeys.splice(index, 1);
      array().splice(index, 1);
    },
  };
}
