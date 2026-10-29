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
  ENUM_KEY,
  IF_KEY,
  ITEMS_KEY,
  NOT_KEY,
  ONE_OF_KEY,
  REF_KEY,
  REQUIRED_KEY,
  THEN_KEY,
  type Schema,
  type SchemaDefinition,
} from "./schema.js";
import { getSimpleSchemaType } from "./type.js";

type SchemaKey = Exclude<keyof Schema, symbol>;
type SchemaValue = Schema[SchemaKey];
type SubschemaValue = SchemaDefinition | SchemaDefinition[];
type SchemaObject = Schema & Record<string, SchemaValue | undefined>;

function isStringArray(value: SchemaValue | undefined): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isSubschemaKeyword(key: string): boolean {
  return (
    isSubSchemasRecordKey(key) ||
    isSubSchemasArrayKey(key) ||
    isSubSchemaKey(key)
  );
}

function keywordShape(
  key: string,
  value: SchemaValue | undefined
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

const KEYWORDS_LEFT_ON_PARENT: ReadonlySet<string> = new Set<string>([
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
] satisfies SchemaKey[]);

const LOWER_BOUNDS: ReadonlySet<string> = new Set<string>([
  "minItems",
  "minLength",
  "minProperties",
  "minimum",
  "exclusiveMinimum",
] satisfies SchemaKey[]);
const UPPER_BOUNDS: ReadonlySet<string> = new Set<string>([
  "maxItems",
  "maxLength",
  "maxProperties",
  "maximum",
  "exclusiveMaximum",
] satisfies SchemaKey[]);

const KEYWORDS_TAKEN_FROM_OPTION: ReadonlySet<string> = new Set<string>([
  CONST_KEY,
  DEFAULT_KEY,
  ENUM_KEY,
  NOT_KEY,
] satisfies SchemaKey[]);
const CONDITIONAL_KEYWORDS: ReadonlySet<string> = new Set<string>([
  IF_KEY,
  THEN_KEY,
  ELSE_KEY,
] satisfies SchemaKey[]);
const POSITIONAL_KEYWORDS: ReadonlySet<string> = new Set<string>([
  ITEMS_KEY,
] satisfies SchemaKey[]);

function meetSchemas(
  merger: Merger,
  parent: SchemaObject,
  option: SchemaObject
): SchemaObject {
  const result: SchemaObject = { ...parent, ...option };
  let takesOptionConditional = false;
  for (const key of CONDITIONAL_KEYWORDS) {
    if (option[key] !== undefined) {
      takesOptionConditional = true;
      break;
    }
  }
  for (const [key, optionValue] of Object.entries(option)) {
    if (optionValue === undefined) {
      if (Object.hasOwn(parent, key)) {
        setOwn(result, key, parent[key]);
      } else {
        delete result[key];
      }
    } else if (Object.hasOwn(parent, key) && !CONDITIONAL_KEYWORDS.has(key)) {
      setOwn(result, key, meetKeyword(merger, key, parent[key], optionValue));
    }
  }
  const parentItems = parent[ITEMS_KEY];
  const optionItems = option[ITEMS_KEY];
  const parentAdditionalItems = parent[ADDITIONAL_ITEMS_KEY];
  const optionAdditionalItems = option[ADDITIONAL_ITEMS_KEY];
  if (
    Array.isArray(parentItems) &&
    isSchemaDefinition(parentAdditionalItems) &&
    isSchemaDefinition(optionItems)
  ) {
    setOwn(
      result,
      ADDITIONAL_ITEMS_KEY,
      meetSchemaDefinition(merger, parentAdditionalItems, optionItems)
    );
  } else if (
    isSchemaDefinition(parentItems) &&
    Array.isArray(optionItems) &&
    isSchemaDefinition(optionAdditionalItems)
  ) {
    setOwn(
      result,
      ADDITIONAL_ITEMS_KEY,
      meetSchemaDefinition(merger, parentItems, optionAdditionalItems)
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
  key: string,
  parentValue: SchemaValue | undefined,
  optionValue: SchemaValue | undefined
): SchemaValue | undefined {
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
    if (
      key === REQUIRED_KEY &&
      isStringArray(parentValue) &&
      isStringArray(optionValue)
    ) {
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
    isRecord<SchemaValue | undefined>(parentValue) &&
    isRecord<SchemaValue | undefined>(optionValue) &&
    keywordShape(key, parentValue) === "map"
  ) {
    const entries: Record<string, SchemaValue | undefined> = {
      ...parentValue,
      ...optionValue,
    };
    for (const [name, optionEntry] of Object.entries(optionValue)) {
      if (Object.hasOwn(parentValue, name)) {
        const parentEntry = parentValue[name];
        setOwn(
          entries,
          name,
          isSchemaDefinition(parentEntry) && isSchemaDefinition(optionEntry)
            ? meetSchemaDefinition(merger, parentEntry, optionEntry)
            : optionEntry
        );
      }
    }
    return entries as SchemaValue;
  }
  if (
    POSITIONAL_KEYWORDS.has(key) &&
    parentValue !== false &&
    optionValue !== true
  ) {
    if (
      isSchemaDefinitionArray(parentValue) &&
      isSchemaDefinitionArray(optionValue)
    ) {
      return meetTuples(merger, parentValue, optionValue);
    }
    if (
      isSchemaDefinitionArray(parentValue) &&
      isSchemaDefinition(optionValue)
    ) {
      return parentValue.map((position) =>
        meetSchemaDefinition(merger, position, optionValue)
      );
    }
    if (
      isSchemaDefinitionArray(optionValue) &&
      isSchemaDefinition(parentValue)
    ) {
      return optionValue.map((position) =>
        meetSchemaDefinition(merger, parentValue, position)
      );
    }
  }
  return meetSubschema(merger, parentValue, optionValue);
}

function isSchemaDefinition(
  value: SchemaValue | undefined
): value is SchemaDefinition {
  return typeof value === "boolean" || isRecord(value);
}

function isSubschemaValue(
  value: SchemaValue | undefined
): value is SubschemaValue {
  return isSchemaDefinition(value) || isSchemaDefinitionArray(value);
}

function isSchemaDefinitionArray(
  value: SchemaValue | undefined
): value is SchemaDefinition[] {
  return Array.isArray(value) && value.every(isSchemaDefinition);
}

function meetTuples(
  merger: Merger,
  parent: SchemaDefinition[],
  option: SchemaDefinition[]
): SchemaDefinition[] {
  return Array.from(
    { length: Math.max(parent.length, option.length) },
    (_, index) => {
      if (index >= option.length) {
        return parent[index]!;
      }
      return index < parent.length
        ? meetSchemaDefinition(merger, parent[index]!, option[index]!)
        : option[index]!;
    }
  );
}

function meetSchemaDefinition(
  merger: Merger,
  parent: SchemaDefinition,
  option: SchemaDefinition
): SchemaDefinition {
  if (parent === false || option === true) {
    return parent;
  }
  if (parent === true || option === false) {
    return option;
  }
  return Object.hasOwn(parent, REF_KEY) || Object.hasOwn(option, REF_KEY)
    ? { [ALL_OF_KEY]: [parent, option] }
    : meetSchemas(merger, parent as SchemaObject, option as SchemaObject);
}

function meetSubschema(
  merger: Merger,
  parent: SchemaValue | undefined,
  option: SchemaValue | undefined
): SubschemaValue | undefined {
  if (parent === undefined) {
    return isSubschemaValue(option) ? option : undefined;
  }
  if (parent === false) {
    return false;
  }
  if (option === true) {
    return isSubschemaValue(parent) ? parent : undefined;
  }
  if (option === undefined) {
    return isSubschemaValue(parent) ? parent : undefined;
  }
  if (!isSchemaDefinition(parent) || !isSchemaDefinition(option)) {
    return isSubschemaValue(option) ? option : undefined;
  }
  return meetSchemaDefinition(merger, parent, option);
}

export function rendersOwnFieldBesideOption(schema: Schema): boolean {
  return getSimpleSchemaType(schema) === "object";
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
  const parentObject = parent as SchemaObject;
  const optionObject = option as SchemaObject;
  const inherited: SchemaObject = {};
  if (rendersOwnField) {
    if (parent.required?.length) {
      inherited[REQUIRED_KEY] = parent.required;
    }
    if (option.type === undefined) {
      inherited.type = parent.type ?? "object";
    }
  } else {
    for (const [key, value] of Object.entries(parentObject)) {
      if (!KEYWORDS_LEFT_ON_PARENT.has(key)) {
        setOwn(inherited, key, value);
      }
    }
  }
  if (Object.keys(inherited).length === 0) {
    return option;
  }
  if (!rendersOwnField) {
    return meetSchemas(merger, inherited, optionObject);
  }
  const merged = merger.mergeSchemas(inherited, optionObject);
  if (merged.required === undefined && inherited[REQUIRED_KEY] !== undefined) {
    merged.required = inherited[REQUIRED_KEY];
  }
  if (merged.type === undefined && inherited.type !== undefined) {
    merged.type = inherited.type;
  }
  return merged;
}
