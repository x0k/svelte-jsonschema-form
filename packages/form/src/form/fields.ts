import type { Component as SvelteComponent } from "svelte";

import { fromRecord, type Resolver } from "@/lib/resolver.js";
import type {
  SchemaValue,
  ONE_OF_KEY,
  ANY_OF_KEY,
  SchemaObjectValue,
  SchemaArrayValue,
  Schema,
} from "@/core/index.js";

import type { Config } from "./config.js";

export interface FieldCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config;
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
    isAdditional: boolean;
  };

  array: FieldCommonProps<V>;
  anotherFieldArray: FieldCommonProps<V> & {
    field: "multiEnum" | "files";
  };
  fixedArray: FieldCommonProps<V>;
  normalArray: FieldCommonProps<V>;
  arrayItem: FieldCommonProps<V> & {
    index: number;
    canCopy: boolean;
    canRemove: boolean;
    canMoveUp: boolean;
    canMoveDown: boolean;
  };

  null: FieldCommonProps<V>;
  enum: FieldCommonProps<V>;
  multiEnum: FieldCommonProps<V> & {
    itemSchema: Schema;
  };
  file: FieldCommonProps<V>;
  files: FieldCommonProps<V>;
  hidden: FieldCommonProps<V>;
}

export interface FieldBindings {
  root: "value";
  multi: "value";
  string: "value";
  number: "value";
  integer: "value";
  boolean: "value";
  object: "value";
  objectProperty: "value";
  array: "value";
  anotherFieldArray: "value";
  fixedArray: "value";
  normalArray: "value";
  arrayItem: "value";
  null: "value";
  enum: "value";
  multiEnum: "value";
  file: "value";
  files: "value";
  hidden: "value";
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
  anotherFieldArray: SchemaArrayValue;
  fixedArray: SchemaArrayValue;
  normalArray: SchemaArrayValue;
  arrayItem: SchemaValue;
  null: null;
  enum: SchemaValue;
  multiEnum: SchemaArrayValue;
  file: string;
  files: string[];
  hidden: SchemaValue;
}

export type FieldType = keyof FieldsAndProps<SchemaValue>;

export type FieldProps<T extends FieldType> = FieldsAndProps<FieldValue[T]>[T];

export type Field<T extends FieldType> = SvelteComponent<
  FieldProps<T>,
  {},
  FieldBindings[T]
>;

export type Fields = {
  [T in FieldType]: Field<T>;
};

export type FieldsResolver = Resolver<FieldType, Config, Fields, undefined>;

export const createFields = fromRecord as (
  r: Partial<Fields>
) => FieldsResolver;
