import type { Field, Fields, FieldType } from "./model";

import Root from "./root.svelte";
import String from './string.svelte'

export const registry: { [T in FieldType]: Field<T> } = {
  root: Root,
  string: String
};

export const fields: Fields = (type) => registry[type]
