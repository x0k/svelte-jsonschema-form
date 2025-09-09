export interface KeyedArray<K, V> {
  key(index: number): K;
  push(value: V): number;
  swap(a: number, b: number): void;
  insert(index: number, value: V): void;
  remove(index: number): V | undefined;
  splice(index: number, count?: number): V[];
  splice(index: number, count: number, ...items: V[]): V[];
}

// TODO: Remove in v4
/** @deprecated use `KeyedArray` */
export type KeyedArray2<K, V> = KeyedArray<K, V>;

export class SimpleKeyedArray<K, T> implements KeyedArray<K, T> {
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
