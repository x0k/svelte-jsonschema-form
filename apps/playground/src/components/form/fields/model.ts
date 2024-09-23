import type { Component as SvelteComponent } from "svelte";

import type { Schema, SchemaArrayValue, SchemaObjectValue, SchemaValue } from "../schema";
import type { UiSchema } from "../ui-schema";
import type { IdSchema } from "../id-schema";

export interface FieldCommonProps<V extends SchemaValue> {
  name: string;
  value: V | undefined
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchema<V>;
  required: boolean;
}

export interface FieldAndProps {
  root: {};
  string: {};
  number: {};
  integer: {};
  boolean: {};
  object: {};
  array: {};
  null: {};
  unsupported: {};
}

export interface FieldValue {
  root: SchemaValue;
  string: string
  number: number;
  integer: number;
  boolean: boolean;
  object: SchemaObjectValue
  array: SchemaArrayValue
  null: null;
  unsupported: SchemaValue;
}

export type FieldType = keyof FieldAndProps;

export type FieldProps<T extends FieldType> = FieldAndProps[T] &
  FieldCommonProps<FieldValue[T]>;

export type Field<T extends FieldType> = SvelteComponent<
  FieldProps<T>,
  {},
  "value"
>;

export type Fields = <T extends FieldType>(type: T) => Field<T>;
