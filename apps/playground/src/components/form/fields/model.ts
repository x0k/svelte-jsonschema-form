import type { Component as SvelteComponent } from "svelte";

import type {
  Schema,
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "../schema";
import type { UiSchema } from "../ui-schema";
import type { IdSchema } from "../id-schema";

export interface FieldCommonProps<V extends SchemaValue> {
  name: string;
  value: V | undefined;
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchema<V>;
  required: boolean;
}

export interface FieldAndProps<V extends SchemaValue> {
  root: Omit<FieldCommonProps<V>, "idSchema"> & {
    idSchema?: IdSchema<SchemaValue>;
  };
  string: FieldCommonProps<V>;
  number: FieldCommonProps<V>;
  integer: FieldCommonProps<V>;
  boolean: FieldCommonProps<V>;
  object: FieldCommonProps<V>;
  array: FieldCommonProps<V>;
  null: FieldCommonProps<V>;
  enum: FieldCommonProps<V>;
  unsupported: FieldCommonProps<V>;
}

export interface FieldValue {
  root: SchemaValue;
  string: string;
  number: number;
  integer: number;
  boolean: boolean;
  object: SchemaObjectValue;
  array: SchemaArrayValue;
  null: null;
  enum: SchemaValue;
  unsupported: SchemaValue;
}

export type FieldType = keyof FieldAndProps<SchemaValue>;

export type FieldProps<T extends FieldType> = FieldAndProps<FieldValue[T]>[T];

export type Field<T extends FieldType> = SvelteComponent<
  FieldProps<T>,
  {},
  "value"
>;

export type Fields = <T extends FieldType>(
  type: T,
  uiSchema: UiSchema
) => Field<T> | undefined;
