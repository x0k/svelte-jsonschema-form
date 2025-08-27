import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

export type TransformedSchema<R, S> = Omit<
  S,
  SubSchemaKey | SubSchemasArrayKey | SubSchemasRecordKey
> & {
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

export interface OpenAPIDiscriminator {
  propertyName: string;
  // mapping?: Record<string, string>;
}

export interface Schema
  extends TransformedSchema<SchemaDefinition, JSONSchema7> {
  discriminator?: OpenAPIDiscriminator;
}
export type SchemaDefinition = boolean | Schema;

export type SchemaWithProperties = Schema & {
  properties: Exclude<Schema["properties"], undefined>;
};

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

// WARN: Order is important
export const RECORDS_OF_SUB_SCHEMAS = [
  DEFS_KEY,
  DEFINITIONS_KEY,
  PROPERTIES_KEY,
  PATTERN_PROPERTIES_KEY,
  DEPENDENCIES_KEY,
] as const;

export const SET_OF_RECORDS_OF_SUB_SCHEMAS = new Set(RECORDS_OF_SUB_SCHEMAS);

export type SubSchemasRecordKey = (typeof RECORDS_OF_SUB_SCHEMAS)[number];

// WARN: Order is important
export const ARRAYS_OF_SUB_SCHEMAS = [
  ITEMS_KEY,
  ALL_OF_KEY,
  ONE_OF_KEY,
  ANY_OF_KEY,
] as const;

export const SET_OF_ARRAYS_OF_SUB_SCHEMAS = new Set(ARRAYS_OF_SUB_SCHEMAS);

export type SubSchemasArrayKey = (typeof ARRAYS_OF_SUB_SCHEMAS)[number];

// WARN: Order is important
export const SUB_SCHEMAS = [
  ITEMS_KEY,
  ADDITIONAL_ITEMS_KEY,
  ADDITIONAL_PROPERTIES_KEY,
  PROPERTY_NAMES_KEY,
  CONTAINS_KEY,
  IF_KEY,
  THEN_KEY,
  ELSE_KEY,
  NOT_KEY,
] as const;

export const SET_OF_SUB_SCHEMAS = new Set(SUB_SCHEMAS);

export type SubSchemaKey = (typeof SUB_SCHEMAS)[number];

// WARN: Order is important
export const SCHEMA_KEYS = [
  ...RECORDS_OF_SUB_SCHEMAS,
  ...ARRAYS_OF_SUB_SCHEMAS,
  ...SUB_SCHEMAS,
];

export type SchemaKey = (typeof SCHEMA_KEYS)[number];

export function isSchema(schemaDef: SchemaDefinition): schemaDef is Schema {
  return typeof schemaDef === "object";
}

export function isSchemaWithProperties(
  schema: Schema
): schema is SchemaWithProperties {
  return schema.properties !== undefined;
}

export function isNormalArrayItems(items: Schema["items"]): items is Schema {
  return typeof items === "object" && !Array.isArray(items);
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
