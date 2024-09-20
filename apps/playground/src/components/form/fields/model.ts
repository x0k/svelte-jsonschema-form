import type { Component as SvelteComponent } from "svelte";

import type { Schema } from "../schema";
import type { UiSchema } from "../ui-schema";

export interface FieldCommonProps<V> {
  value: V;
  schema: Schema;
  uiSchema: UiSchema;
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
  root: unknown;
  string: string;
  number: number;
  integer: number;
  boolean: boolean;
  object: Record<string, unknown>;
  array: unknown[];
  null: null;
  unsupported: unknown;
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
