import type { Component as SvelteComponent } from "svelte";

import type { Schema } from "../schema";
import type { UiSchema } from "../ui-schema";

export interface CommonProps<T> {
  value: T;
  schema: Schema;
  uiSchema: UiSchema;
}

export interface FieldProps {
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

export type FieldType = keyof FieldProps;

export type Field<T extends FieldType> = SvelteComponent<
  FieldProps[T] & CommonProps<FieldValue[T]>,
  {},
  "value"
>;

export type Fields = <T extends FieldType>(type: T) => Field<T>;
