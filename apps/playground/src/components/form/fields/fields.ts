import type { Field, Fields, FieldType } from "./model";

import Root from "./root.svelte";
import Null from './null.svelte'
import String from './string.svelte'
import Number from './number.svelte'
import Boolean from './boolean.svelte';
import Unsupported from './unsupported.svelte';
import Object from './object.svelte';

export const fieldsRegistry: { [T in FieldType]: Field<T> } = {
  root: Root,
  null: Null,
  string: String,
  // TODO: Integer field
  integer: Number,
  number: Number,
  boolean: Boolean,
  unsupported: Unsupported,
  object: Object,
};

export const fields: Fields = (type) => fieldsRegistry[type]
