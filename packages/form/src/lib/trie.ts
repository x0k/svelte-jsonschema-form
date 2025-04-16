export interface Node<T, V> {
  values: Map<T, Node<T, V>>;
  value: V | undefined;
}

export type Trie<T, V> = Node<T, V> | undefined;

export function insertValue<T, V>(trie: Trie<T, V>, keys: T[], value: V): Node<T, V> {
  if (trie === undefined) {
    trie = {
      values: new Map(),
      value: undefined
    };
  }
  if (keys.length === 0) {
    trie.value = value;
    return trie;
  }
  trie.values.set(keys[0]!, insertValue(trie.values.get(keys[0]!), keys.slice(1), value));
  return trie;
}

export function getNodeByKeys<T, V>(trie: Trie<T, V>, keys: T[]): Trie<T, V> {
  let i = 0;
  while (trie !== undefined && i < keys.length) {
    trie = trie.values.get(keys[i++]!);
  }
  return trie;
}

export function getValueByKeys<T, V>(trie: Trie<T, V>, keys: T[]): V | undefined {
  return getNodeByKeys(trie, keys)?.value
}
