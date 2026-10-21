// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/e84af11a656a33724bae3173d0c7ac6e86fb1727/packages/utils/src/getRenderedOptionSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  isSubSchemaKey,
  isSubSchemasArrayKey,
  isSubSchemasRecordKey,
} from "#lib/json-schema/index.js";
import { isRecord, setOwn } from "#lib/object.js";

import type { Merger } from "./merger.js";
import {
  ADDITIONAL_ITEMS_KEY,
  ALL_OF_KEY,
  ANY_OF_KEY,
  CONST_KEY,
  DEFAULT_KEY,
  ELSE_KEY,
  IF_KEY,
  ITEMS_KEY,
  NOT_KEY,
  ONE_OF_KEY,
  REF_KEY,
  REQUIRED_KEY,
  THEN_KEY,
  type Schema,
  type SchemaType,
} from "./schema.js";
import { getSimpleSchemaType } from "./type.js";

type SchemaKey = Exclude<keyof Schema, symbol>;
type SchemaRecord = Partial<Record<SchemaKey, unknown>>;

const ENUM_KEY = "enum";

function entriesOf(schema: SchemaRecord): [SchemaKey, unknown][] {
  return Object.entries(schema) as [SchemaKey, unknown][];
}

function isSubschemaKeyword(key: SchemaKey): boolean {
  return (
    isSubSchemasRecordKey(key) ||
    isSubSchemasArrayKey(key) ||
    isSubSchemaKey(key)
  );
}

function keywordShape(
  key: SchemaKey,
  value: unknown
): "map" | "array" | "single" | undefined {
  if (isSubSchemasRecordKey(key) && isRecord(value)) {
    return "map";
  }
  if (isSubSchemasArrayKey(key) && Array.isArray(value)) {
    return "array";
  }
  if (isSubSchemaKey(key) && isRecord(value)) {
    return "single";
  }
  return undefined;
}

const KEYWORDS_LEFT_ON_PARENT = new Set<SchemaKey>([
  ANY_OF_KEY,
  ONE_OF_KEY,
  "discriminator",
  "title",
  "description",
  DEFAULT_KEY,
  "$id",
  "$schema",
  "$comment",
  "$defs",
  "definitions",
]);

const LOWER_BOUNDS = new Set<SchemaKey>([
  "minItems",
  "minLength",
  "minProperties",
  "minimum",
  "exclusiveMinimum",
]);
const UPPER_BOUNDS = new Set<SchemaKey>([
  "maxItems",
  "maxLength",
  "maxProperties",
  "maximum",
  "exclusiveMaximum",
]);

const KEYWORDS_TAKEN_FROM_OPTION = new Set<SchemaKey>([
  CONST_KEY,
  DEFAULT_KEY,
  ENUM_KEY,
  NOT_KEY,
]);
const CONDITIONAL_KEYWORDS = [IF_KEY, THEN_KEY, ELSE_KEY] as const;
const POSITIONAL_KEYWORDS = new Set<SchemaKey>([ITEMS_KEY]);

function meetSchemas(
  merger: Merger,
  parent: SchemaRecord,
  option: SchemaRecord
): SchemaRecord {
  const result: SchemaRecord = { ...parent, ...option };
  const takesOptionConditional = CONDITIONAL_KEYWORDS.some(
    (key) => option[key] !== undefined
  );
  for (const [key, optionValue] of entriesOf(option)) {
    if (optionValue === undefined) {
      if (Object.hasOwn(parent, key)) {
        setOwn(result, key, parent[key]);
      } else {
        delete result[key];
      }
    } else if (
      Object.hasOwn(parent, key) &&
      !CONDITIONAL_KEYWORDS.includes(
        key as (typeof CONDITIONAL_KEYWORDS)[number]
      )
    ) {
      setOwn(result, key, meetKeyword(merger, key, parent[key], optionValue));
    }
  }
  const parentItems = parent[ITEMS_KEY];
  const optionItems = option[ITEMS_KEY];
  if (
    Array.isArray(parentItems) &&
    parent[ADDITIONAL_ITEMS_KEY] !== undefined &&
    optionItems !== undefined &&
    optionItems !== true &&
    !Array.isArray(optionItems)
  ) {
    setOwn(
      result,
      ADDITIONAL_ITEMS_KEY,
      meetSubschema(merger, parent[ADDITIONAL_ITEMS_KEY], optionItems)
    );
  } else if (
    isRecord(parentItems) &&
    Array.isArray(optionItems) &&
    option[ADDITIONAL_ITEMS_KEY] !== undefined
  ) {
    setOwn(
      result,
      ADDITIONAL_ITEMS_KEY,
      meetSubschema(merger, parentItems, option[ADDITIONAL_ITEMS_KEY])
    );
  }
  if (takesOptionConditional) {
    for (const key of CONDITIONAL_KEYWORDS) {
      if (option[key] === undefined) {
        delete result[key];
      }
    }
  }
  return result;
}

function meetKeyword(
  merger: Merger,
  key: SchemaKey,
  parentValue: unknown,
  optionValue: unknown
): unknown {
  if (KEYWORDS_TAKEN_FROM_OPTION.has(key)) {
    return optionValue;
  }
  if (typeof parentValue === "number" && typeof optionValue === "number") {
    if (LOWER_BOUNDS.has(key)) {
      return Math.max(parentValue, optionValue);
    }
    return UPPER_BOUNDS.has(key)
      ? Math.min(parentValue, optionValue)
      : optionValue;
  }
  if (key === "uniqueItems") {
    return parentValue === true || optionValue;
  }
  if (Array.isArray(parentValue) && Array.isArray(optionValue)) {
    if (key === REQUIRED_KEY) {
      return Array.from(new Set([...parentValue, ...optionValue]));
    }
    if (key === ENUM_KEY) {
      return optionValue;
    }
  }
  if (!isSubschemaKeyword(key)) {
    return isRecord(parentValue) && isRecord(optionValue)
      ? merger.mergeSchemas(parentValue as Schema, optionValue as Schema)
      : optionValue;
  }
  if (
    isRecord(parentValue) &&
    isRecord(optionValue) &&
    keywordShape(key, parentValue) === "map"
  ) {
    const entries: SchemaRecord = { ...parentValue, ...optionValue };
    for (const [name, optionEntry] of Object.entries(optionValue)) {
      if (Object.hasOwn(parentValue, name)) {
        setOwn(
          entries as Record<string, unknown>,
          name,
          meetSubschema(merger, parentValue[name], optionEntry)
        );
      }
    }
    return entries;
  }
  if (
    POSITIONAL_KEYWORDS.has(key) &&
    parentValue !== false &&
    optionValue !== true
  ) {
    if (Array.isArray(parentValue) && Array.isArray(optionValue)) {
      return meetTuples(merger, parentValue, optionValue);
    }
    if (Array.isArray(parentValue)) {
      return parentValue.map((position) =>
        meetSubschema(merger, position, optionValue)
      );
    }
    if (Array.isArray(optionValue)) {
      return optionValue.map((position) =>
        meetSubschema(merger, parentValue, position)
      );
    }
  }
  return meetSubschema(merger, parentValue, optionValue);
}

function meetTuples(
  merger: Merger,
  parent: unknown[],
  option: unknown[]
): unknown[] {
  return Array.from(
    { length: Math.max(parent.length, option.length) },
    (_, index) => {
      if (index >= option.length) {
        return parent[index];
      }
      return index < parent.length
        ? meetSubschema(merger, parent[index], option[index])
        : option[index];
    }
  );
}

function meetSubschema(
  merger: Merger,
  parent: unknown,
  option: unknown
): unknown {
  if (parent === undefined) {
    return option;
  }
  if (parent === false || option === true || option === undefined) {
    return parent;
  }
  if (!isRecord(parent) || !isRecord(option)) {
    return option;
  }
  return Object.hasOwn(parent, REF_KEY) || Object.hasOwn(option, REF_KEY)
    ? { [ALL_OF_KEY]: [parent, option] }
    : meetSchemas(merger, parent, option);
}

const KNOWN_SCHEMA_TYPES = new Set<SchemaType>([
  "null",
  "boolean",
  "object",
  "array",
  "number",
  "string",
  "integer",
]);

function getSchemaType(schema: Schema): SchemaType {
  const type = schema.type;
  if (Array.isArray(type)) {
    return (
      type.find((type) => type !== "null" && KNOWN_SCHEMA_TYPES.has(type)) ??
      type.find((type) => type !== "null") ??
      "null"
    );
  }
  if (!type && schema.enum !== undefined) {
    return "string";
  }
  return type ?? getSimpleSchemaType(schema);
}

export function rendersOwnFieldBesideOption(schema: Schema): boolean {
  return getSchemaType(schema) === "object";
}

/**
 * Returns the schema an `anyOf`/`oneOf` option is rendered with. An object
 * parent renders its own object field beside the option, so the option only
 * inherits its `required` and `type`. Every other parent leaves the whole
 * field to the option, so the option inherits the parent's value keywords.
 */
export function getRenderedOptionSchema(
  merger: Merger,
  parent: Schema,
  option: Schema
): Schema {
  const rendersOwnField = rendersOwnFieldBesideOption(parent);
  const inherited: SchemaRecord = {};
  if (rendersOwnField) {
    if (parent.required?.length) {
      inherited[REQUIRED_KEY] = parent.required;
    }
    if (option.type === undefined) {
      inherited.type = parent.type ?? "object";
    }
  } else {
    for (const [key, value] of entriesOf(parent)) {
      if (!KEYWORDS_LEFT_ON_PARENT.has(key)) {
        setOwn(inherited, key, value);
      }
    }
  }
  if (Object.keys(inherited).length === 0) {
    return option;
  }
  if (!rendersOwnField) {
    return meetSchemas(merger, inherited, option as SchemaRecord) as Schema;
  }
  const merged = merger.mergeSchemas(
    inherited as Schema,
    option
  ) as SchemaRecord;
  for (const key of Object.keys(inherited) as SchemaKey[]) {
    if (merged[key] === undefined) {
      setOwn(merged, key, inherited[key]);
    }
  }
  return merged as Schema;
}
