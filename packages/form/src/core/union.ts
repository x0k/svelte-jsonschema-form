// Adapted from RJSF's FallbackField type selector:
// https://github.com/rjsf-team/react-jsonschema-form/pull/5323
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { JSONSchema7TypeName } from "json-schema";

import {
  ADDITIONAL_PROPERTIES_KEY,
  ADDITIONAL_PROPERTY_FLAG,
  ANY_OF_KEY,
  ONE_OF_KEY,
  PATTERN_PROPERTIES_KEY,
  PROPERTIES_KEY,
  REF_FLAG,
  type Schema,
  type SchemaType,
  type SchemaValue,
} from "./schema.js";
import { typeOfValue } from "./type.js";

/** The text that reads as a `false` boolean, once trimmed and lower-cased. */
const FALSE_SPELLINGS = ["false", "0", "no", "off"];

/**
 * The notation a number is written in, which is the one the number field's own
 * input accepts. `Number()` reads more than that — hex, binary and octal, and
 * the word `Infinity` — so text switched to a number without this check comes
 * back as a value nobody typed.
 */
const DECIMAL_NOTATION = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

export function getUnionTypes(schema: Schema) {
  if (!Array.isArray(schema.type)) {
    return undefined;
  }
  const types = new Set(schema.type);
  return types.size > 2 || (types.size === 2 && !types.has("null"))
    ? types
    : undefined;
}

export function isUnionSchema(schema: Schema) {
  return (
    schema.const === undefined &&
    schema.enum === undefined &&
    getUnionTypes(schema) !== undefined
  );
}

/**
 * Casts the given form value to the specified type.
 *
 * The cast is deliberately conservative: a value with no reading a user would
 * have typed becomes the empty value of the target type rather than a made-up
 * one, so switching type never fills in data the user did not enter.
 */
export function castToUnionType(
  value: SchemaValue | undefined,
  type: JSONSchema7TypeName
): SchemaValue | undefined {
  switch (type) {
    case "string":
      // A value of any other shape has no text form a user would have typed:
      // `String()` would put the literal `null` or `[object Object]` into the
      // input as though it were real data.
      return value == null || typeof value === "object" ? "" : String(value);
    case "number":
    case "integer": {
      // A value with no numeric form — a boolean, or text that is blank or
      // written in a notation the number field would not take back — leaves the
      // field empty rather than holding a `0`: a `0` satisfies `required` and
      // `minimum` as real input.
      if (
        value == null ||
        typeof value === "object" ||
        typeof value === "boolean"
      ) {
        return undefined;
      }
      const text = String(value).trim();
      if (text === "" || !DECIMAL_NOTATION.test(text)) {
        return undefined;
      }
      const number = Number(text);
      if (!Number.isFinite(number)) {
        return undefined;
      }
      // A fractional value has no integer a user would have typed either:
      // rounding it would rewrite the data they entered.
      if (type === "integer" && !Number.isInteger(number)) {
        return undefined;
      }
      return number;
    }
    case "boolean": {
      const text = typeof value === "string" ? value.trim() : undefined;
      if (value == null || typeof value === "object" || text === "") {
        return undefined;
      }
      // Text that spells a false boolean reads back as `false`, since
      // `Boolean()` reads it the other way round: `Boolean("false")` is `true`.
      return text !== undefined
        ? !FALSE_SPELLINGS.includes(text.toLowerCase())
        : Boolean(value);
    }
    case "null":
      return null;
    // An array or object cannot hold the data of any other type, so they start
    // out empty.
    case "array":
      return [];
    case "object":
      return {};
    default:
      return value;
  }
}

/**
 * Returns the schema the value field renders for `type`: the schema with its
 * `type` pinned to the one the selector is on, so every other keyword — a
 * union's `properties`, `enum`, `items`, `format`, ... — still describes the
 * value being entered.
 *
 * The markers resolution adds are dropped: `REF_FLAG` would make the value
 * field look like an already-resolved reference, which cycle handling reads,
 * and `ADDITIONAL_PROPERTY_FLAG` describes how this schema was reached rather
 * than what the pinned value accepts. A `$id` is dropped because the value
 * schema is not the schema that identifier names — its `type` is pinned to one
 * of the several that one allows. `title` and `description` belong to the
 * union field around the value, which renders them once, so the value field
 * does not repeat them.
 */
export function getUnionValueSchema(
  schema: Schema,
  type: JSONSchema7TypeName
): Schema {
  const valueSchema = { ...schema, type } as Schema;
  delete valueSchema[ADDITIONAL_PROPERTY_FLAG];
  delete valueSchema[REF_FLAG];
  delete valueSchema.$id;
  delete valueSchema.title;
  delete valueSchema.description;
  // A `null` is the whole of the value it describes, so there is nothing for an
  // option to say about it, and keeping the options would leave an option
  // selector standing over a field that renders nothing.
  const hasOptions = ANY_OF_KEY in valueSchema || ONE_OF_KEY in valueSchema;
  if (type === "null") {
    delete valueSchema[ANY_OF_KEY];
    delete valueSchema[ONE_OF_KEY];
  }
  // An object the schema says nothing more about takes any key/value pair,
  // which is what the type selector is here to offer. Options are what says
  // more about it, even when the members they describe are their own rather
  // than the schema's: taking them for silence would stub the keys the data
  // already holds as additional properties of the value field.
  const describesMembers =
    PROPERTIES_KEY in valueSchema ||
    ADDITIONAL_PROPERTIES_KEY in valueSchema ||
    PATTERN_PROPERTIES_KEY in valueSchema ||
    hasOptions;
  // An empty `additionalProperties` schema is what the object field reads as
  // "can add any key"; a boolean `true` is handled by
  // `isObjectSchemaExpandable`, so it is left as is.
  if (type === "object" && !describesMembers) {
    valueSchema[ADDITIONAL_PROPERTIES_KEY] = {};
  }
  return valueSchema;
}

/**
 * Determines whether a field for `type` can show data of `dataType` as the
 * value it is. The textual types stand in for one another while a value is
 * being edited — a `number` field holds the string `"3."` until the user types
 * the next digit — but every other type only shows data of its own.
 */
export function canUnionTypeShowData(
  type: JSONSchema7TypeName,
  dataType: SchemaType
): boolean {
  const isTextual = (aType: SchemaType) =>
    aType === "string" || aType === "number" || aType === "integer";
  return (isTextual(type) && isTextual(dataType)) || type === dataType;
}

/** The first type that can hold a value, falling back to a lone `null`. */
function getDefaultTypeIndex(types: JSONSchema7TypeName[]): number {
  const index = types.findIndex((type) => type !== "null");
  return index < 0 ? 0 : index;
}

/**
 * Determines which of the `types` the selection starts on, preferring the type
 * the current value already has so existing data is shown by the field that
 * matches it. An integer-only schema takes a number, and a value of a type the
 * schema does not allow falls back to the first type offered, as does having no
 * value to go on at all.
 */
export function getInitialUnionTypeIndex(
  types: JSONSchema7TypeName[],
  value: SchemaValue | undefined
): number {
  if (value === undefined) {
    return getDefaultTypeIndex(types);
  }
  const dataType = typeOfValue(value);
  let index = types.indexOf(dataType as JSONSchema7TypeName);
  if (index < 0) {
    if (dataType === "number") {
      index = types.indexOf("integer");
    } else if (dataType === "integer") {
      index = types.indexOf("number");
    }
  }
  return index < 0 ? getDefaultTypeIndex(types) : index;
}
