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
  | File
  | Date
  | null;

export interface SchemaObjectValue {
  [key: string]: SchemaValue;
}

export interface SchemaArrayValue extends Array<SchemaValue> {}

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

export const IF_KEY = "if";
export const THEN_KEY = "then";
export const ELSE_KEY = "else";

export const ALL_OF_KEY = "allOf";
export const ANY_OF_KEY = "anyOf";
export const ONE_OF_KEY = "oneOf";

export const NOT_KEY = "not";

export const ADDITIONAL_PROPERTY_FLAG = "__additional_property";
export const ADDITIONAL_PROPERTIES_KEY = "additionalProperties";
export const CONTAINS_KEY = "contains";

export const DISCRIMINATOR_KEY = "discriminator";
export const PROPERTY_NAME_KEY = "propertyName";

export function isSchema(schemaDef: SchemaDefinition): schemaDef is Schema {
  return typeof schemaDef === "object";
}
