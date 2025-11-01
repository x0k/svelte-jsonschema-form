export interface EmptyNode<T, V> {
  values: Map<T, Node<T, V>>;
  value: undefined;
}

export interface ValueNode<T, V> {
  values: Map<T, Node<T, V>>;
  value: V;
}

export type Node<T, V> = EmptyNode<T, V> | ValueNode<T, V>;

export type Trie<T, V> = Node<T, V> | undefined;

export interface Seq<T> {
  [index: number]: T;
  length: number;
}

export function insertValue<T, V>(
  trie: Trie<T, V>,
  keys: Seq<T>,
  value: V,
  index = 0
): Node<T, V> {
  if (trie === undefined) {
    trie = {
      values: new Map(),
      value: undefined,
    };
  }
  if (keys.length === index) {
    trie.value = value;
  } else {
    trie.values.set(
      keys[index]!,
      insertValue(trie.values.get(keys[index]!), keys, value, index + 1)
    );
  }
  return trie;
}

export function getNodeByKeys<T, V>(
  trie: Trie<T, V>,
  keys: Seq<T>
): Trie<T, V> {
  let i = 0;
  while (trie !== undefined && i < keys.length) {
    trie = trie.values.get(keys[i++]!);
  }
  return trie;
}

export function getValueByKeys<T, V>(
  trie: Trie<T, V>,
  keys: Seq<T>
): V | undefined {
  return getNodeByKeys(trie, keys)?.value;
}

export function getNodeByShortestPrefix<T, V>(
  trie: Trie<T, V>,
  keys: Seq<T>
): Trie<T, V> {
  let i = 0;
  while (trie !== undefined && trie.value === undefined && i < keys.length) {
    trie = trie.values.get(keys[i++]!);
  }
  return trie;
}
