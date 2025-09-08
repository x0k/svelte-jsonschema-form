// TODO: Remove in v3
/** @deprecated use `KeyedArray2` */
export interface KeyedArray<T> {
  key(index: number): number;
  push(value: T): void;
  swap(a: number, b: number): void;
  insert(index: number, value: T): void;
  remove(index: number): void;
}

const EMPTY: never[] = [];

// TODO: Remove in v3
/** @deprecated migrate to `KeyedArray2` */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export function createKeyedArray<T>(array: () => T[]): KeyedArray<T> {
  let arrayRef: WeakRef<T[]> = new WeakRef(EMPTY);
  let lastKeys: number[] = EMPTY;
  let lastKey = -1;
  let changesPropagator = $state.raw(0);
  const keys = $derived.by(() => {
    const arr = array();
    if (arrayRef.deref() === arr) {
      return lastKeys;
    }
    arrayRef = new WeakRef(arr);
    lastKeys = new Array<number>(arr.length);
    for (let i = 0; i < arr.length; i++) {
      // NOTE: there is no `wrap-around` behavior
      // But i think `Infinity` is unreachable here
      lastKeys[i] = ++lastKey;
    }
    return lastKeys;
  });
  return {
    key(index: number) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      changesPropagator;
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
      if (arr[a] === arr[b]) {
        changesPropagator++;
      } else {
        const tmp = arr[a]!;
        arr[a] = arr[b]!;
        arr[b] = tmp;
      }
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

export interface KeyedArray2<K, V> {
  key(index: number): K;
  push(value: V): number;
  swap(a: number, b: number): void;
  insert(index: number, value: V): void;
  remove(index: number): V | undefined;
  splice(index: number, count?: number): V[];
  splice(index: number, count: number, ...items: V[]): V[];
}

export class SimpleKeyedArray<K, T> implements KeyedArray2<K, T> {
  protected changesPropagator = $state.raw(0);

  protected keys: K[];

  constructor(
    protected readonly array: T[],
    protected readonly nextKey: () => K
  ) {
    const keys = new Array<K>(array.length);
    for (let i = 0; i < array.length; i++) {
      keys[i] = nextKey();
    }
    this.keys = keys;
  }

  key(index: number): K {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.changesPropagator;
    return this.keys[index]!;
  }

  push(value: T) {
    this.keys.push(this.nextKey());
    return this.array.push(value);
  }

  swap(a: number, b: number): void {
    const key = this.keys[a];
    this.keys[a] = this.keys[b]!;
    this.keys[b] = key!;
    if (this.array[a] === this.array[b]) {
      this.changesPropagator++;
    } else {
      const tmp = this.array[a]!;
      this.array[a] = this.array[b]!;
      this.array[b] = tmp;
    }
  }

  insert(index: number, value: T): void {
    this.keys.splice(index, 0, this.nextKey());
    this.array.splice(index, 0, value);
  }

  remove(index: number) {
    this.keys.splice(index, 1);
    return this.array.splice(index, 1)[0];
  }

  splice(start: number, count: number, ...items: T[]): T[] {
    const l = items.length;
    if (l > 0) {
      const newKeys = new Array<K>(items.length);
      for (let i = 0; i < l; i++) {
        newKeys[i] = this.nextKey();
      }
      this.keys.splice(start, count, ...newKeys);
      return this.array.splice(start, count, ...items);
    } else {
      this.keys.splice(start, count);
      return this.array.splice(start, count);
    }
  }
}
