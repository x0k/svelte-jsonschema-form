export function createConditionMapper<V, T extends V, R>(
  isType: (v: V) => v is T,
  mapType: (l: T, r: T) => R,
  mapTypeL: (l: T, r: Exclude<V, T>) => R,
  mapTypeR: (l: Exclude<V, T>, r: T) => R,
  mapNonType: (l: Exclude<V, T>, r: Exclude<V, T>) => R
) {
  return (a: V, b: V) => {
    if (isType(a)) {
      if (isType(b)) {
        return mapType(a, b);
      }
      return mapTypeL(a, b as Exclude<V, T>);
    }
    if (isType(b)) {
      return mapTypeR(a as Exclude<V, T>, b);
    }
    return mapNonType(a as Exclude<V, T>, b as Exclude<V, T>);
  };
}
