import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

import type { TransformedSchema } from "@/lib/json-schema/index.js";

export interface OpenAPIDiscriminator {
  propertyName: string;
  // mapping?: Record<string, string>;
}

export interface Schema
  extends TransformedSchema<SchemaDefinition, JSONSchema7> {
  discriminator?: OpenAPIDiscriminator;
  [ADDITIONAL_PROPERTY_FLAG]?: boolean;
}
export type SchemaDefinition = boolean | Schema;

export type SchemaWithProperties = Schema & {
  properties: Exclude<Schema["properties"], undefined>;
};

export type SchemaType = JSONSchema7TypeName;

export interface SchemaValues {
  null: null
  string: string;
  number: number;
  boolean: boolean;
  object: SchemaObjectValue
  array: SchemaArrayValue
}

export type SchemaValue = SchemaValues[keyof SchemaValues];

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
// TODO: Turn into a Symbol
export const ADDITIONAL_PROPERTY_FLAG = "__additional_property";
export const ADDITIONAL_PROPERTIES_KEY = "additionalProperties";
export const ADDITIONAL_ITEMS_KEY = "additionalItems";
export const PROPERTY_NAMES_KEY = "propertyNames";

export const DISCRIMINATOR_KEY = "discriminator";
export const PROPERTY_NAME_KEY = "propertyName";

export const DATA_URL_FORMAT = "data-url";

export function isSchemaWithProperties(
  schema: Schema
): schema is SchemaWithProperties {
  return schema.properties !== undefined;
}

export function isNormalArrayItems(items: Schema["items"]): items is Schema {
  return typeof items === "object" && !Array.isArray(items);
}
