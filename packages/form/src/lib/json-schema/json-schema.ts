import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { isRecordEmpty } from "@/lib/object.js";

type SchemaKeys = Array<keyof JSONSchema7>;

// WARN: Order is important
export const RECORDS_OF_SUB_SCHEMAS = [
  "$defs",
  "definitions",
  "properties",
  "patternProperties",
  "dependencies",
] as const satisfies SchemaKeys;

export const SET_OF_RECORDS_OF_SUB_SCHEMAS = new Set(RECORDS_OF_SUB_SCHEMAS);

export type SubSchemasRecordKey = (typeof RECORDS_OF_SUB_SCHEMAS)[number];

// WARN: Order is important
export const ARRAYS_OF_SUB_SCHEMAS = [
  "items",
  "allOf",
  "oneOf",
  "anyOf",
] as const satisfies SchemaKeys;

export const SET_OF_ARRAYS_OF_SUB_SCHEMAS = new Set(ARRAYS_OF_SUB_SCHEMAS);

export type SubSchemasArrayKey = (typeof ARRAYS_OF_SUB_SCHEMAS)[number];

// WARN: Order is important
export const SUB_SCHEMAS = [
  "items",
  "additionalItems",
  "additionalProperties",
  "propertyNames",
  "contains",
  "if",
  "then",
  "else",
  "not",
] as const satisfies SchemaKeys;

export const SET_OF_SUB_SCHEMAS = new Set(SUB_SCHEMAS);

export type SubSchemaKey = (typeof SUB_SCHEMAS)[number];

// WARN: Order is important
export const ALL_SUB_SCHEMA_KEYS = [
  ...RECORDS_OF_SUB_SCHEMAS,
  ...ARRAYS_OF_SUB_SCHEMAS,
  ...SUB_SCHEMAS,
];

export type AnySubSchemaKey = (typeof ALL_SUB_SCHEMA_KEYS)[number];

export type TransformedSchema<R, S> = Omit<S, AnySubSchemaKey> & {
  items?: R | R[] | undefined;
  additionalItems?: R | undefined;
  contains?: R | undefined;
  additionalProperties?: R | undefined;
  propertyNames?: R | undefined;
  if?: R | undefined;
  then?: R | undefined;
  else?: R | undefined;
  not?: R | undefined;
  // Records
  $defs?: Record<string, R> | undefined;
  properties?: Record<string, R> | undefined;
  patternProperties?: Record<string, R> | undefined;
  dependencies?: Record<string, R | string[]> | undefined;
  definitions?: Record<string, R> | undefined;
  // Arrays
  allOf?: R[] | undefined;
  anyOf?: R[] | undefined;
  oneOf?: R[] | undefined;
};

export type TransformedSchemaDefinition<R, S> =
  | TransformedSchema<R, S>
  | boolean;

export function isSchemaObject<D extends JSONSchema7Definition>(
  schemaDef: D
): schemaDef is Exclude<D, boolean> {
  return typeof schemaDef === "object";
}

export function isAllowAnySchema(
  def: JSONSchema7Definition
): def is true | Record<string, never> {
  return isSchemaObject(def) ? isRecordEmpty(def) : def === true;
}

export function isSubSchemaKey(key: string): key is SubSchemaKey {
  return SET_OF_SUB_SCHEMAS.has(key as SubSchemaKey);
}

export function isSubSchemasArrayKey(key: string): key is SubSchemasArrayKey {
  return SET_OF_ARRAYS_OF_SUB_SCHEMAS.has(key as SubSchemasArrayKey);
}

export function isSubSchemasRecordKey(key: string): key is SubSchemasRecordKey {
  return SET_OF_RECORDS_OF_SUB_SCHEMAS.has(key as SubSchemasRecordKey);
}
