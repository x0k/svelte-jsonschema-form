import type { Component as SvelteComponent } from "svelte";

import type {
  SchemaValue,
  ONE_OF_KEY,
  ANY_OF_KEY,
  SchemaObjectValue,
  SchemaArrayValue,
} from "@/core/index.js";

import type { Config } from "../config.js";
import type { FormContext } from "../context.js";
import { createMessage } from "../error-message.svelte";

export interface FieldCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config<V>;
}

export interface FieldsAndProps<V extends SchemaValue> {
  root: FieldCommonProps<V>;
  multi: FieldCommonProps<V> & {
    combinationKey: typeof ONE_OF_KEY | typeof ANY_OF_KEY;
  };
  string: FieldCommonProps<V>;
  number: FieldCommonProps<V>;
  integer: FieldCommonProps<V>;
  boolean: FieldCommonProps<V>;

  object: FieldCommonProps<V>;
  objectProperty: FieldCommonProps<V> & {
    property: string;
    obj: SchemaObjectValue;
    isAdditional: boolean;
  };

  array: FieldCommonProps<V>;
  unsupportedArray: FieldCommonProps<V>;
  anotherFieldArray: FieldCommonProps<V> & {
    field: "enum" | "file";
  };
  fixedArray: FieldCommonProps<V>;
  normalArray: FieldCommonProps<V>;
  arrayItem: FieldCommonProps<V> & {
    index: number;
    arr: SchemaArrayValue;
    canRemove: boolean;
    canMoveUp: boolean;
    canMoveDown: boolean;
  };

  null: FieldCommonProps<V>;
  enum: FieldCommonProps<V> & {
    multiple?: boolean;
  };
  file: FieldCommonProps<V> & {
    multiple?: boolean;
  };
  hidden: FieldCommonProps<V>;
  unsupported: FieldCommonProps<V>;
}

export interface FieldBindings {
  root: "value";
  multi: "value";
  string: "value";
  number: "value";
  integer: "value";
  boolean: "value";
  object: "value";
  objectProperty: "value" | "obj";
  array: "value";
  unsupportedArray: "value";
  anotherFieldArray: "value";
  fixedArray: "value";
  normalArray: "value";
  arrayItem: "value" | "arr";
  null: "value";
  enum: "value";
  file: "value";
  hidden: "value";
  unsupported: "value";
}

export interface FieldValue {
  root: SchemaValue;
  multi: SchemaValue;
  string: string;
  number: number;
  integer: number;
  boolean: boolean;
  object: SchemaObjectValue;
  objectProperty: SchemaValue;
  array: SchemaArrayValue;
  unsupportedArray: SchemaArrayValue;
  anotherFieldArray: SchemaArrayValue;
  fixedArray: SchemaArrayValue;
  normalArray: SchemaArrayValue;
  arrayItem: SchemaValue;
  null: null;
  enum: SchemaValue;
  file: string | SchemaArrayValue;
  hidden: SchemaValue;
  unsupported: SchemaValue;
}

export type FieldType = keyof FieldsAndProps<SchemaValue>;

export type FieldProps<T extends FieldType> = FieldsAndProps<FieldValue[T]>[T];

export type Field<T extends FieldType> = SvelteComponent<
  FieldProps<T>,
  {},
  // @ts-expect-error something with typescript
  FieldBindings[T]
>;

export type Fields = <T extends FieldType>(
  type: T,
  config: Config
) => Field<T> | undefined;

function getFieldInternal<T extends FieldType>(
  ctx: FormContext,
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
  ctx: FormContext,
  type: T,
  config: Config
): Field<T> {
  return (
    getFieldInternal(ctx, type, config) ??
    (ctx.fields("unsupported", config) as Field<T>) ??
    createMessage(`Field "${config.uiSchema["ui:field"] ?? type}" not found`)
  );
}
