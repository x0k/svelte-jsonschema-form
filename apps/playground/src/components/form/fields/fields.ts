import type { Field, Fields, FieldType } from "./model";

import { ArrayField } from "./array";
import { ObjectField } from "./object";
import { StringField } from "./string";
import RootField from "./root-field.svelte";
import NullField from "./null-field.svelte";
import NumberField from "./number-field.svelte";
import IntegerField from "./integer-field.svelte";
import BooleanField from "./boolean-field.svelte";
import UnsupportedField from "./unsupported-field.svelte";

export const fieldsRegistry: { [T in FieldType]: Field<T> } = {
  root: RootField,
  null: NullField,
  integer: IntegerField,
  number: NumberField,
  boolean: BooleanField,
  unsupported: UnsupportedField,
  string: StringField,
  object: ObjectField,
  array: ArrayField,
};

export const fields: Fields = (type) => fieldsRegistry[type];
