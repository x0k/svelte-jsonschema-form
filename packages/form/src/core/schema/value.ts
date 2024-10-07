import { isRecord, isObject } from "@/lib/object";

import type {
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "./schema";

export function isSchemaObjectValue(
  value: unknown
): value is SchemaObjectValue {
  return isRecord(value);
}

export function isSchemaArrayValue(value: unknown): value is SchemaArrayValue {
  return Array.isArray(value);
}

export function isSchemaValueEmpty<V extends SchemaValue>(value: V) {
  if (!isObject(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return Object.keys(value).length === 0;
}
