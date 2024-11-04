import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

export type Schema = JSONSchema7;
export type SchemaDefinition = Schema | boolean;

export type SchemaType = JSONSchema7TypeName;

export type SchemaValue =
  | string
  | number
  | boolean
  | SchemaObjectValue
  | SchemaArrayValue
  | null;

export interface SchemaObjectValue {
  [key: string]: SchemaValue | undefined;
}

export interface SchemaArrayValue extends Array<SchemaValue | undefined> {}

export const REF_KEY = "$ref";
export const ID_KEY = "$id";
export const DEFS_KEY = "$defs";

export const DEFINITIONS_KEY = "definitions";
export const PROPERTIES_KEY = "properties";
export const ITEMS_KEY = "items";
export const DEPENDENCIES_KEY = "dependencies";
export const REQUIRED_KEY = "required";
export const PATTERN_PROPERTIES_KEY = "patternProperties";
export const DEFAULT_KEY = "default";
export const CONST_KEY = "const";

export const IF_KEY = "if";
export const THEN_KEY = "then";
export const ELSE_KEY = "else";
export const CONTAINS_KEY = "contains";

export const ALL_OF_KEY = "allOf";
export const ANY_OF_KEY = "anyOf";
export const ONE_OF_KEY = "oneOf";

export const NOT_KEY = "not";

export const ROOT_SCHEMA_PREFIX = "__sjsf_rootSchema";
export const ADDITIONAL_PROPERTY_FLAG = "__additional_property";
export const ADDITIONAL_PROPERTIES_KEY = "additionalProperties";
export const ADDITIONAL_ITEMS_KEY = "additionalItems";
export const PROPERTY_NAMES_KEY = "propertyNames";

export const DISCRIMINATOR_KEY = "discriminator";
export const PROPERTY_NAME_KEY = "propertyName";

export const DATA_URL_FORMAT = "data-url";

export const SUB_SCHEMAS = [
  ITEMS_KEY,
  ADDITIONAL_ITEMS_KEY,
  CONTAINS_KEY,
  ADDITIONAL_PROPERTIES_KEY,
  PROPERTY_NAMES_KEY,
  IF_KEY,
  THEN_KEY,
  ELSE_KEY,
  NOT_KEY,
] as const;

export type SubSchemaKey = (typeof SUB_SCHEMAS)[number];

export const RECORDS_OF_SUB_SCHEMAS = [
  DEFS_KEY,
  PROPERTIES_KEY,
  PATTERN_PROPERTIES_KEY,
  DEPENDENCIES_KEY,
  DEFINITIONS_KEY,
] as const;

export type SubSchemasRecordKey = (typeof RECORDS_OF_SUB_SCHEMAS)[number];

export const ARRAYS_OF_SUB_SCHEMAS = [
  ALL_OF_KEY,
  ANY_OF_KEY,
  ONE_OF_KEY,
  ITEMS_KEY,
] as const;

export type SubSchemasArrayKey = (typeof ARRAYS_OF_SUB_SCHEMAS)[number];

export function isSchema(schemaDef: SchemaDefinition): schemaDef is Schema {
  return typeof schemaDef === "object";
}

export function isNormalArrayItems(items: Schema["items"]): items is Schema {
  return typeof items === "object" && !Array.isArray(items);
}
