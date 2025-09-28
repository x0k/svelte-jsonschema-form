import type { KeyedArray } from "@/lib/keyed-array.svelte.js";
import {
  getSchemaDefinitionByPath,
  type Path,
  type Schema,
  type SchemaArrayValue,
  type SchemaValue,
} from "@/core/index.js";

export type Creatable<Result, Options> =
  | ((options: Options) => Result)
  | (() => Result)
  | Result;

export type Update<T> = T | ((data: T) => T);

export type FieldValue = SchemaValue | undefined;

export type FormValue = SchemaValue | undefined;

export type KeyedFieldValues = KeyedArray<number, FieldValue>;

export type KeyedArraysMap = WeakMap<SchemaArrayValue, KeyedFieldValues>;

export const DEFAULT_BOOLEAN_ENUM = [true, false];

export function getRootSchemaTitleByPath(
  rootSchema: Schema,
  path: Path
): string | undefined {
  const def = getSchemaDefinitionByPath(rootSchema, rootSchema, path);
  return typeof def === "object" ? def.title : undefined;
}

export function create<R, O>(creatable: Creatable<R, O>, options: O) {
  return typeof creatable === "function"
    ? (creatable as (o: O) => R)(options)
    : creatable;
}
