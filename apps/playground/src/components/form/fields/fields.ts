import type { Field, Fields, FieldType } from "./model";

import Root from "./root.svelte";
import Null from './null.svelte'
import String from './string.svelte'
import Number from './number.svelte'
import Boolean from './boolean.svelte';
import Unsupported from './unsupported.svelte';

export const registry: { [T in FieldType]: Field<T> } = {
  root: Root,
  null: Null,
  string: String,
  // TODO: Integer field
  integer: Number,
  number: Number,
  boolean: Boolean,
  unsupported: Unsupported,
};

export const fields: Fields = (type) => registry[type]
