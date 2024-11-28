export interface MapLike<K, V> {
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): void;
}

export function memoize<Arg, Return>(
  cache: MapLike<Arg, Return>,
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  return (arg: Arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    let ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
}

export const weakMemoize = memoize as <Arg extends object, Return>(
  cache: WeakMap<Arg, Return>,
  fn: (arg: Arg) => Return
) => (arg: Arg) => Return;
