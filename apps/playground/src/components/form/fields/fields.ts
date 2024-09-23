import type { Field, Fields, FieldType } from "./model";

import Root from "./root.svelte";
import String from './string.svelte'
import Number from './number.svelte'

export const registry: { [T in FieldType]: Field<T> } = {
  root: Root,
  string: String,
  // TODO: Integer field
  integer: Number,
  number: Number,
};

export const fields: Fields = (type) => registry[type]
