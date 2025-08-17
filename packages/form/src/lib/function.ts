export function noop() {}

export function identity<T>(v: T): T {
  return v;
}

export function createPairMatcher<V, T extends V, R>(
  isType: (v: V) => v is T,
  mapBoth: (l: T, r: T) => R,
  mapLeft: (l: T, r: Exclude<V, T>) => R,
  mapRight: (l: Exclude<V, T>, r: T) => R,
  mapNothing: (l: Exclude<V, T>, r: Exclude<V, T>) => R
) {
  return (a: V, b: V) => {
    if (isType(a)) {
      if (isType(b)) {
        return mapBoth(a, b);
      }
      return mapLeft(a, b as Exclude<V, T>);
    }
    if (isType(b)) {
      return mapRight(a as Exclude<V, T>, b);
    }
    return mapNothing(a as Exclude<V, T>, b as Exclude<V, T>);
  };
}
