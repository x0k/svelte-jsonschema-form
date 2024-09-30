import type { Component as SvelteComponent } from "svelte";

import type {
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "../schema";
import { createMessage, type Config } from "../config";
import type { FormContext } from "../context";

export interface FieldCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config<V>;
}

export interface FieldAndProps<V extends SchemaValue> {
  root: FieldCommonProps<V>;
  string: FieldCommonProps<V>;
  number: FieldCommonProps<V>;
  integer: FieldCommonProps<V>;
  boolean: FieldCommonProps<V>;
  object: FieldCommonProps<V>;
  array: FieldCommonProps<V>;
  null: FieldCommonProps<V>;
  enum: FieldCommonProps<V> & {
    multiple?: boolean;
  };
  file: FieldCommonProps<V> & {
    multiple?: boolean;
  }
  hidden: FieldCommonProps<V>;
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
  file: string | SchemaArrayValue;
  hidden: SchemaValue;
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
  config: Config
) => Field<T> | undefined;

function getFieldInternal<T extends FieldType>(
  ctx: FormContext<unknown>,
  type: T,
  config: Config
): Field<T> | undefined {
  const field = config.uiSchema["ui:field"];
  switch (typeof field) {
    case "undefined":
      return ctx.fields(type, config);
    case "string":
      return ctx.fields(field as T, config);
    default:
      return field as Field<T>;
  }
}

export function getField<T extends FieldType>(
  ctx: FormContext<unknown>,
  type: T,
  config: Config
): Field<T> {
  return (
    getFieldInternal(ctx, type, config) ??
    (ctx.fields("unsupported", config) as Field<T>) ??
    createMessage(`Field "${config.uiSchema["ui:field"] ?? type}" not found`)
  );
}
