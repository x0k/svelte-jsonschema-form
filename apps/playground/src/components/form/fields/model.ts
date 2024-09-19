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
}

export type FieldType = keyof FieldProps;

export type Field<T extends FieldType, V> = SvelteComponent<
  FieldProps[T] & CommonProps<V>,
  {},
  "value"
>;

export type Fields = <T extends FieldType, V>(type: T) => Field<T, V>;
