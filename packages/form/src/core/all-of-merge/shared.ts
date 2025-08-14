export function insertUniqueValues<K>(
  mutableTarget: K[],
  mutableSource: K[]
): K[] {
  const tl = mutableTarget.length;
  if (tl === 0) return mutableSource;
  let sl = mutableSource.length;
  if (sl === 0) return mutableTarget;
  if (sl > tl) {
    const t = mutableTarget;
    mutableTarget = mutableSource;
    mutableSource = t;
  }
  const seen = new Set(mutableTarget);
  const l = mutableSource.length;
  for (let i = 0; i < l; i++) {
    const key = mutableSource[i]!;
    if (!seen.has(key)) {
      mutableTarget.push(key);
    }
  }
  return mutableTarget;
}

export function createConditionMapper<V, T extends V, R>(
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
