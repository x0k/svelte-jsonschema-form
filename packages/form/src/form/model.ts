import type { KeyedArray } from "@/lib/keyed-array.svelte.js";
import type { Ref } from "@/lib/svelte.svelte.js";
import type { Trie } from "@/lib/trie.js";
import type {
  EnumOption,
  RPath,
  SchemaArrayValue,
  SchemaValue,
} from "@/core/index.js";

export type Creatable<Result, Options> =
  | ((options: Options) => Result)
  | (() => Result)
  | Result;

export type Update<T> = T | ((data: T) => T);

export type FieldValue = SchemaValue | undefined;

export type FormValue = SchemaValue | undefined;

export type KeyedFieldValues = KeyedArray<number, FieldValue>;

export type KeyedArraysMap = WeakMap<SchemaArrayValue, KeyedFieldValues>;

export type FormValueRef = Ref<FormValue>;

export type PathTrieRef<T> = Ref<Trie<RPath[number], T>>;

export type FormEnumOption = EnumOption<SchemaValue> & {
  // TODO: Make required in v4
  mappedValue?: string;
};

export const DEFAULT_BOOLEAN_ENUM = [true, false];

export function create<R, O>(creatable: Creatable<R, O>, options: O) {
  return typeof creatable === "function"
    ? (creatable as (o: O) => R)(options)
    : creatable;
}
