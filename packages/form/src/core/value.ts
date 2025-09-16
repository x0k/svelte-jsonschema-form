import { isRecord, isObject, isRecordEmpty } from "@/lib/object.js";

import type {
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "./schema.js";

export function isSchemaObjectValue(
  value: unknown
): value is SchemaObjectValue {
  return isRecord(value);
}

export function isSchemaArrayValue(value: unknown): value is SchemaArrayValue {
  return Array.isArray(value);
}

/**
 * Broad emptiness:
 * Anything that doesn’t match known categories is treated as empty.
 */
export function isSchemaValueEmpty<V extends SchemaValue>(
  value: V | undefined
) {
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }
  if (!isObject(value)) {
    return true;
  }
  if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
    return value.byteLength === 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) {
    return isRecordEmpty(value);
  }
  if (Object.prototype.hasOwnProperty.call(proto, "size")) {
    return value.size === 0;
  }
  return true;
}

export function schemaValueToString(v: SchemaValue) {
  return typeof v === "string" ? v : JSON.stringify(v);
}
