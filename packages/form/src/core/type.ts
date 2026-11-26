import { additionalPropertiesKeyword } from "./additional-properties.js";
import type {
  Schema,
  SchemaDefinition,
  SchemaType,
  SchemaTypeBase,
} from "./schema.js";
import { getAllOfOptions, getXxxOfOptions } from "./xxx-of-options.js";

const SCHEMA_TYPES: SchemaTypeBase[] = [
  "string", // 0
  "number", // 1
  "integer", // 2
  "boolean", // 3
  "object", // 4
  "array", // 5
  "null", // 6
];

function getValueTypeIndex(
  value: null | boolean | number | string | object
): number {
  if (value === null) {
    return 6;
  }
  if (Array.isArray(value)) {
    return 5;
  }
  const type = typeof value;
  // `1` is a `number`, not an `integer`. In JSON Schema `integer` is a subset
  // of `number`, and callers compare this name straight to `schema.type`, so
  // calling `1` an `integer` would reject it under `{ type: "number" }`.
  // Only the union selector needs the narrower name; it asks for both.
  switch (type) {
    case "string":
      return 0;
    case "number":
      return 1;
    case "boolean":
      return 3;
    case "object":
      return 4;
    default:
      return -1;
  }
}

function getSchemaOwnType(schema: Schema, out: SchemaTypeBase[]) {
  if (schema.type !== undefined) {
    if (Array.isArray(schema.type)) {
      // TODO: deduplication
      for (let i = 0; i < schema.type.length; i++) {
        out.push(schema.type[i]!);
      }
    } else {
      out.push(schema.type);
    }
    return;
  }
  if (schema.const !== undefined) {
    out.push(SCHEMA_TYPES[getValueTypeIndex(schema.const)]!);
    return;
  }
  if (
    schema.properties ||
    additionalPropertiesKeyword(schema) ||
    schema.propertyNames ||
    schema.patternProperties
  ) {
    out.push("object");
    return;
  }
  if (!Array.isArray(schema.enum)) {
    return;
  }
  let mask = 0;
  for (let i = 0; i < schema.enum.length; i++) {
    const id = getValueTypeIndex(schema.enum[i]!);
    const shifted = 1 << id;
    if (!(mask & shifted)) {
      out.push(SCHEMA_TYPES[id]!);
      mask |= shifted;
    }
  }
}

function getSchemaType(schema: Schema, out: SchemaTypeBase[]) {
  getSchemaOwnType(schema, out);
  if (out.length > 0) {
    return;
  }
  // `oneOf`/`anyOf` describe the alternatives a value can take, so they answer
  // first; `allOf` is the fallback when they say nothing.
  const alt = getXxxOfOptions(schema)?.options ?? getAllOfOptions(schema);
  if (alt === undefined) {
    return;
  }
  for (let i = 0; i < alt.length; i++) {
    const item = alt[i]!;
    if (typeof item === "boolean") {
      continue;
    }
    getSchemaType(item, out);
  }
}

export function typeOfValue(
  value: null | boolean | number | string | object
): SchemaType {
  return SCHEMA_TYPES[getValueTypeIndex(value)] ?? "unknown";
}

export function typeOfSchema(schema: Schema): SchemaType | SchemaTypeBase[] {
  const types: SchemaTypeBase[] = [];
  getSchemaType(schema, types);
  return types.length > 0 ? types : "unknown";
}

/** Reads a combinator's option types: `oneOf`/`anyOf` need every option to
 * agree, `allOf` takes the first typed entry. Boolean and typeless options
 * count as no type, so an `xxxOf` with any of those falls through to `allOf`. */
function readOptionTypes(
  options: SchemaDefinition[],
  agree: boolean
): SchemaTypeBase | undefined {
  let found: SchemaTypeBase | undefined;
  let typed = 0;
  for (let i = 0; i < options.length; i++) {
    const option = options[i]!;
    const type =
      typeof option === "boolean"
        ? undefined
        : getAdditionalPropertyType(option);
    if (type === undefined) {
      if (agree) return undefined;
      continue;
    }
    if (!agree) return type;
    if (found !== undefined && found !== type) return undefined;
    found = type;
    typed++;
  }
  return typed === options.length ? found : undefined;
}

/** The type an additional-property schema agrees on, or `undefined` when only
 * the value can say. A `oneOf`/`anyOf` with disagreeing options leaves the type
 * to the field that chooses between them. */
export function getAdditionalPropertyType(
  schema: Schema
): SchemaTypeBase | undefined {
  const own: SchemaTypeBase[] = [];
  getSchemaOwnType(schema, own);
  if (own.length > 0) {
    return pickSchemaType(own);
  }
  const xxxOf = getXxxOfOptions(schema)?.options;
  if (xxxOf !== undefined) {
    const type = readOptionTypes(xxxOf, true);
    if (type !== undefined) return type;
  }
  const allOf = getAllOfOptions(schema);
  return allOf === undefined ? undefined : readOptionTypes(allOf, false);
}

export function isNullableSchemaType(type: SchemaType | SchemaType[]): boolean {
  return type === "null" || (Array.isArray(type) && type.includes("null"));
}

export function isSchemaNullable(schema: Schema): boolean {
  return isNullableSchemaType(typeOfSchema(schema));
}

export function pickSchemaType<T extends SchemaType>(types: T | T[]): T {
  if (!Array.isArray(types)) {
    return types;
  }
  if (types.length === 0) {
    throw new Error(`Unsupported schema types: empty type array`);
  }
  const first = types[0]!;
  if (types.length === 1) {
    return first;
  }
  if (first === "null") {
    return types[1]!;
  }
  return first;
}

export function getSimpleSchemaType(schema: Schema): SchemaType {
  return pickSchemaType(typeOfSchema(schema));
}

export function matchSchemaType(
  types: SchemaType | SchemaType[],
  type: SchemaType
): SchemaType | undefined {
  if (types.includes(type)) {
    return type;
  }
  if (type === "number" && types.includes("integer")) {
    return "integer";
  }
  return undefined;
}

export function isPrimitiveSchemaType(type: SchemaType): boolean {
  return (
    type === "boolean" ||
    type === "integer" ||
    type === "number" ||
    type === "string" ||
    type === "null"
  );
}

export function isArrayOrObjectSchemaType(type: SchemaType): boolean {
  return type === "array" || type === "object";
}
