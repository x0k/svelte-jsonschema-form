import type { Component as SvelteComponent } from "svelte";

import type { Schema, SchemaValue } from "../schema";
import type { UiSchema } from "../ui-schema";
import type { IdSchema } from "../id-schema";

export interface FieldCommonProps<V> {
  name: string;
  value: V;
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
  string: string;
  number: number;
  integer: number;
  boolean: boolean;
  object: Record<string, SchemaValue>;
  array: SchemaValue[];
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
