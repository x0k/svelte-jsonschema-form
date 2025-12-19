import { isObject, isRecordProto } from "@/lib/object.js";

import type { Schema, SchemaValue } from "./schema.js";

function compareRecords(
  a: Record<PropertyKey, SchemaValue | undefined>,
  b: Record<PropertyKey, SchemaValue | undefined>,
  compare: (a: SchemaValue | undefined, b: SchemaValue | undefined) => boolean
): boolean {
  const aKeys = Object.keys(a);
  let key;
  for (let i = aKeys.length; i-- !== 0; ) {
    key = aKeys[i]!;
    if (!compare(a[key], b[key])) {
      return false;
    }
  }
  return Object.keys(b).length === aKeys.length;
}

function compareOrderedRecords(
  a: Record<PropertyKey, SchemaValue | undefined>,
  b: Record<PropertyKey, SchemaValue | undefined>,
  compare: (a: SchemaValue | undefined, b: SchemaValue | undefined) => boolean
): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  let key;
  for (let i = aKeys.length; i-- !== 0; ) {
    key = aKeys[i]!;
    if (key !== bKeys[i] || !compare(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

function createSchemaValueComparator(
  compareRecords: (
    a: Record<PropertyKey, SchemaValue | undefined>,
    b: Record<PropertyKey, SchemaValue | undefined>,
    compare: (a: SchemaValue | undefined, b: SchemaValue | undefined) => boolean
  ) => boolean
) {
  return function compare(
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
        !isRecordProto<SchemaValue | undefined>(a) ||
        !isRecordProto<SchemaValue | undefined>(b)
      ) {
        // This should have been handled with ===
        return false;
      }
      return compareRecords(a, b, compare);
    }
    return a !== a && b !== b;
  };
}

export const isSchemaValueDeepEqual =
  createSchemaValueComparator(compareRecords);

export const isSchemaDeepEqual = isSchemaValueDeepEqual as (
  a: Schema | undefined,
  b: Schema | undefined
) => boolean;

export const isOrderedSchemaDeepEqual = createSchemaValueComparator(
  compareOrderedRecords
) as (a: Schema | undefined, b: Schema | undefined) => boolean;
