import { isObject, isRecordProto } from "#lib/object.js";

import type { Schema, SchemaValue } from "./schema.js";

/**
 * Compares two form values.
 *
 * A comparator built by `createSchemaValueComparator` walks records and arrays
 * itself and delegates every other pair to the leaf rule it is given, at any
 * depth. The default leaf rule treats only the same value as equal, `NaN`
 * excepted, so a custom one is the only way to declare two non plain values,
 * such as a `File` or a `Date`, equal.
 */
export type ValueDeepComparator = (
  a: SchemaValue | undefined,
  b: SchemaValue | undefined
) => boolean;

/**
 * The rule `createSchemaValueComparator` delegates to. An alias of
 * `ValueDeepComparator`, named for the pairs it actually receives: anything
 * other than two plain records or two arrays. Such a pair can still contain an
 * object, so this is not a narrower type.
 */
export type LeafValueComparator = ValueDeepComparator;

/**
 * Compares two form values for change detection.
 *
 * Only read by the value comparison paths, such as `sanitizeDataForNewSchema`
 * and the form value reconciler. Schema resolution never consults it.
 */
export interface ValueComparer {
  isValueDeepEqual: ValueDeepComparator;
}

/**
 * How a record is compared against another record. Receives itself as `compare`
 * so that nested values keep following the same rules.
 */
export type RecordsComparator = (
  a: Record<PropertyKey, SchemaValue | undefined>,
  b: Record<PropertyKey, SchemaValue | undefined>,
  compare: ValueDeepComparator
) => boolean;

const BOTH_ARE_NAN: LeafValueComparator = (a, b) => a !== a && b !== b;

/**
 * Compares records without regard to key order.
 */
export const compareRecords: RecordsComparator = (a, b, compare) => {
  const aKeys = Reflect.ownKeys(a);
  let key;
  for (let i = aKeys.length; i-- !== 0;) {
    key = aKeys[i]!;
    if (!compare(a[key], b[key])) {
      return false;
    }
  }
  return Reflect.ownKeys(b).length === aKeys.length;
};

/**
 * Compares records by key order, so that `{"a","b"}` and `{"b","a"}` differ.
 */
export const compareOrderedRecords: RecordsComparator = (a, b, compare) => {
  const aKeys = Reflect.ownKeys(a);
  const bKeys = Reflect.ownKeys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  let key;
  for (let i = aKeys.length; i-- !== 0;) {
    key = aKeys[i]!;
    if (key !== bKeys[i] || !compare(a[key], b[key])) {
      return false;
    }
  }
  return true;
};

/**
 * Builds a comparator that walks arrays and records itself, and delegates every
 * other pair to `equal`. An array paired with a non-array object is the one pair
 * reported unequal without consulting `equal`, in either argument order.
 *
 * `isSchemaValueDeepEqual` is this with `compareRecords` and the default leaf
 * rule; `isOrderedSchemaDeepEqual` is this with `compareOrderedRecords`. Pass
 * your own leaf rule to make non plain values, such as `File` or `Date`,
 * comparable at any depth.
 *
 * @example
 * ```ts
 * createSchemaValueComparator(compareRecords, (a, b) =>
 *   a instanceof Date && b instanceof Date
 *     ? a.getTime() === b.getTime()
 *     : Object.is(a, b)
 * );
 * ```
 */
export function createSchemaValueComparator(
  compareRecords: RecordsComparator,
  equal: LeafValueComparator
): ValueDeepComparator {
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
        for (let i = length; i-- !== 0;) {
          if (!compare(a[i], b[i])) {
            return false;
          }
        }
        return true;
      }
      // Reported unequal without consulting `equal`, mirroring the
      // `Array.isArray(a)` branch above regardless of argument order
      if (Array.isArray(b)) {
        return false;
      }
      if (
        !isRecordProto<SchemaValue | undefined>(a) ||
        !isRecordProto<SchemaValue | undefined>(b)
      ) {
        return equal(a, b);
      }
      return compareRecords(a, b, compare);
    }
    return equal(a, b);
  };
}

const compareSchemaValue = createSchemaValueComparator(
  compareRecords,
  BOTH_ARE_NAN
);

export const isSchemaValueDeepEqual = compareSchemaValue;

export const isSchemaDeepEqual = compareSchemaValue as (
  a: Schema | undefined,
  b: Schema | undefined
) => boolean;

export const isOrderedSchemaDeepEqual = createSchemaValueComparator(
  compareOrderedRecords,
  BOTH_ARE_NAN
) as (a: Schema | undefined, b: Schema | undefined) => boolean;
