import { isObject, isObjectProto } from "@/lib/object.js";

import type { Schema, SchemaValue } from "./schema.js";

export function isSchemaValueDeepEqual(
  a: SchemaValue | undefined,
  b: SchemaValue | undefined
): boolean {
  if (a === b) {
    return true;
  }
  if (isObject(a) && isObject(b)) {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return false;
      }
      const { length } = a;
      if (length !== b.length) {
        return false;
      }
      for (let i = length; i-- !== 0; ) {
        if (!isSchemaValueDeepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    if (
      Array.isArray(b) ||
      !isObjectProto<SchemaValue | undefined>(a) ||
      !isObjectProto<SchemaValue | undefined>(b)
    ) {
      // This should have been handled with ===
      return false;
    }
    const aKeys = Object.keys(a);
    let key;
    for (let i = aKeys.length; i-- !== 0; ) {
      key = aKeys[i]!;
      if (!isSchemaValueDeepEqual(a[key], b[key])) {
        return false;
      }
    }
    return Object.keys(b).length === aKeys.length;
  }
  return a !== a && b !== b;
}

export const isSchemaDeepEqual = isSchemaValueDeepEqual as (
  a: Schema | undefined,
  b: Schema | undefined
) => boolean;
