import type {
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "./schema";

export function isSchemaObjectValue(
  value: unknown
): value is SchemaObjectValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isSchemaArrayValue(value: unknown): value is SchemaArrayValue {
  return Array.isArray(value);
}

export function isSchemaValueEmpty<V extends SchemaValue>(value: V) {
  if (typeof value !== "object" || value === null) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return Object.keys(value).length === 0;
}
