export interface MapLike<K, V> {
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): void;
}

/**
 * Returns the value for `key`, inserting `create(key)` when the key is absent.
 *
 * Equivalent to `Map.prototype.getOrInsertComputed` and
 * `WeakMap.prototype.getOrInsertComputed`.
 */
export function getOrInsertComputed<K, V>(
  map: MapLike<K, V>,
  key: K,
  create: (key: K) => V
): V {
  if (map.has(key)) {
    return map.get(key)!;
  }
  const value = create(key);
  map.set(key, value);
  return value;
}
