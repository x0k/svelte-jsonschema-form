import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

import {
  isAllowAnySchema,
  isSchemaObject,
  type AnySubSchemaKey,
  ALL_SUB_SCHEMA_KEYS,
} from "@/lib/json-schema/index.js";

// TODO: Remove in v3
/** @deprecated use `ALL_SUB_SCHEMA_KEYS` from 'lib/json-schema` */
export const SCHEMA_KEYS = ALL_SUB_SCHEMA_KEYS;

// TODO: Remove in v3
import {
  type SubSchemaKey,
  type SubSchemasArrayKey,
  type SubSchemasRecordKey,
  type TransformedSchema,
  type TransformedSchemaDefinition,
  RECORDS_OF_SUB_SCHEMAS,
  ARRAYS_OF_SUB_SCHEMAS,
  SUB_SCHEMAS,
  SET_OF_ARRAYS_OF_SUB_SCHEMAS,
  SET_OF_RECORDS_OF_SUB_SCHEMAS,
  SET_OF_SUB_SCHEMAS,
  isSubSchemaKey,
  isSubSchemasArrayKey,
  isSubSchemasRecordKey,
} from "@/lib/json-schema/index.js";
export {
  /** @deprecated use `SubSchemaKey` from `lib/json-schema` */
  type SubSchemaKey,
  /** @deprecated use `SubSchemasArrayKey` from `lib/json-schema` */
  type SubSchemasArrayKey,
  /** @deprecated use `SubSchemasRecordKey` from `lib/json-schema` */
  type SubSchemasRecordKey,
  /** @deprecated use `TransformedSchema` from `lib/json-schema` */
  type TransformedSchema,
  /** @deprecated use `TransformedSchemaDefinition` from `lib/json-schema` */
  type TransformedSchemaDefinition,
  /** @deprecated use `RECORDS_OF_SUB_SCHEMAS` from `lib/json-schema` */
  RECORDS_OF_SUB_SCHEMAS,
  /** @deprecated use `ARRAYS_OF_SUB_SCHEMAS` from `lib/json-schema` */
  ARRAYS_OF_SUB_SCHEMAS,
  /** @deprecated use `SUB_SCHEMAS` from `lib/json-schema` */
  SUB_SCHEMAS,
  /** @deprecated use `SET_OF_ARRAYS_OF_SUB_SCHEMAS` from `lib/json-schema` */
  SET_OF_ARRAYS_OF_SUB_SCHEMAS,
  /** @deprecated use `SET_OF_RECORDS_OF_SUB_SCHEMAS` from `lib/json-schema` */
  SET_OF_RECORDS_OF_SUB_SCHEMAS,
  /** @deprecated use `SET_OF_SUB_SCHEMAS` from `lib/json-schema` */
  SET_OF_SUB_SCHEMAS,
  /** @deprecated use `isSubSchemaKey` from `lib/json-schema` */
  isSubSchemaKey,
  /** @deprecated use `isSubSchemasArrayKey` from `lib/json-schema` */
  isSubSchemasArrayKey,
  /** @deprecated use `isSubSchemasRecordKey` from `lib/json-schema` */
  isSubSchemasRecordKey,
};

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

// TODO: Remove in v3
/** @deprecated use `AnySubSchemaKey` from `lib/json-schema` */
export type SchemaKey = AnySubSchemaKey;

// TODO: Remove in v3
/** @deprecated use `isSchemaObject` from `lib/json-schema` */
export const isSchema = isSchemaObject as (d: SchemaDefinition) => d is Schema;

export function isSchemaWithProperties(
  schema: Schema
): schema is SchemaWithProperties {
  return schema.properties !== undefined;
}

export function isNormalArrayItems(items: Schema["items"]): items is Schema {
  return typeof items === "object" && !Array.isArray(items);
}

// TODO: Remove in v3
/** @deprecated use `isAllowAnySchema` from `lib/json-schema` */
export const isTruthySchemaDefinition = isAllowAnySchema;
