import type {
  JSONSchema7Type as SchemaValue,
  JSONSchema7TypeName as SchemaType,
  JSONSchema7Definition,
  JSONSchema7,
} from "json-schema";

import { isEmptyRecord } from "@/lib/object.js";
import { isAllowAnySchema, isSchemaObject } from "@/lib/json-schema.js";
import { createPairMatcher } from "@/lib/function.js";

const zero = () => 0;
const one = () => 1;
const negOne = () => -1;

const isUndefined = <T>(v: T | undefined): v is undefined => v === undefined;

const isEmptyArray = <T>(arr: T[]): arr is [] => arr.length === 0;

type SchemaPrimitiveTypeExceptNullType = Extract<
  SchemaType,
  "string" | "number" | "boolean"
>;
type SchemaPrimitiveTypeExceptNull = string | number | boolean;

const isSchemaPrimitiveExceptNull = (
  value: Exclude<SchemaValue, null>
): value is SchemaPrimitiveTypeExceptNull => typeof value !== "object";

const PRIMITIVE_TYPE_ORDER: Record<
  SchemaPrimitiveTypeExceptNullType,
  0 | 1 | 2
> = {
  boolean: 0,
  number: 1,
  string: 2,
};

type CmpRow = [number, number, number];

const CMP_TABLE: [CmpRow, CmpRow, CmpRow] = [
  [0, -1, -1],
  [1, 0, -1],
  [1, 1, 0],
];

function compareSameTypeSchemaPrimitives<
  T extends SchemaPrimitiveTypeExceptNull,
>(a: T, b: T) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function compareSchemaPrimitive(
  a: SchemaPrimitiveTypeExceptNull,
  b: SchemaPrimitiveTypeExceptNull
) {
  const ta = typeof a as SchemaPrimitiveTypeExceptNullType;
  const tb = typeof b as SchemaPrimitiveTypeExceptNullType;
  return ta === tb
    ? compareSameTypeSchemaPrimitives(a, b)
    : CMP_TABLE[PRIMITIVE_TYPE_ORDER[ta]][PRIMITIVE_TYPE_ORDER[tb]];
}

function createArrayComparator<T>(compare: (a: T, b: T) => number) {
  return (a: T[], b: T[]) => {
    const d = a.length - b.length;
    if (d !== 0) {
      return d;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        const d = compare(a[i]!, b[i]!);
        if (d !== 0) {
          return d;
        }
      }
    }
    return 0;
  };
}

function insertUniqueValues<K>(mutableTarget: K[], mutableSource: K[]): K[] {
  const tl = mutableTarget.length;
  if (tl === 0) return mutableSource;
  let sl = mutableSource.length;
  if (sl === 0) return mutableTarget;
  if (sl > tl) {
    const t = mutableTarget;
    mutableTarget = mutableSource;
    mutableSource = t;
  }
  const seen = new Set(mutableTarget);
  const l = mutableSource.length;
  for (let i = 0; i < l; i++) {
    const key = mutableSource[i]!;
    if (!seen.has(key)) {
      mutableTarget.push(key);
    }
  }
  return mutableTarget;
}

const deduplicationCache = new WeakMap<Array<any>, Array<any>>();

function deduplicate<T>(arr: T[], compare: (a: T, b: T) => number) {
  const cached = deduplicationCache.get(arr);
  if (cached !== undefined) {
    return cached;
  }

  const sorted = arr.slice().sort(compare);
  let wIndex = 0;

  for (let rIndex = 1; rIndex < arr.length; rIndex++) {
    if (compare(sorted[wIndex]!, sorted[rIndex]!) !== 0) {
      if (++wIndex !== rIndex) {
        sorted[wIndex] = sorted[rIndex]!;
      }
    }
  }

  sorted.length = wIndex + 1;
  deduplicationCache.set(arr, sorted);
  return sorted;
}

function createArrayComparatorWithDeduplication<T>(
  compare: (a: T, b: T) => number
) {
  const cmp = createArrayComparator(compare);
  return (a: T[], b: T[]) =>
    cmp(deduplicate(a, compare), deduplicate(b, compare));
}

function createRecordsComparator<K extends string, T>(
  compare: (l: T | undefined, r: T | undefined, key: K) => number
) {
  return (a: Record<K, T>, b: Record<K, T>) => {
    const aKeys = Object.keys(a) as K[];
    const bKeys = Object.keys(b) as K[];
    const d = aKeys.length - bKeys.length;
    if (d !== 0) {
      return d;
    }
    const allKeys = insertUniqueValues(aKeys, bKeys).sort();
    const l = allKeys.length;
    for (let i = 0; i < l; i++) {
      const key = allKeys[i]!;
      if (a[key] === b[key]) {
        continue;
      }
      const d = compare(a[key], b[key], key);
      if (d !== 0) {
        return d;
      }
    }
    return 0;
  };
}

function createCmpMatcher<T, E extends T>(
  isEmpty: (v: T) => v is E,
  compare: (l: Exclude<T, E>, r: Exclude<T, E>) => number,
  compareEmpty: (l: E, r: E) => number = zero
) {
  return createPairMatcher(isEmpty, compareEmpty, negOne, one, compare);
}

function createOptionalComparator<T>(compare: (l: T, r: T) => number) {
  return createCmpMatcher<T | undefined, undefined>(isUndefined, compare);
}

function createNarrowingOptionalComparator<T, E extends T>(
  isEmpty: (v: T) => v is E,
  compare: (
    l: Exclude<T, E | undefined>,
    r: Exclude<T, E | undefined>
  ) => number
) {
  return createCmpMatcher<T | undefined, E | undefined>(
    (v: T | undefined): v is undefined | E => v === undefined || isEmpty(v),
    compare
  );
}

function createArrayOrItemComparator<T, T1>(
  compare: (a: T, b: T) => number,
  compareArray: (a: T1[], b: T1[]) => number
) {
  return createCmpMatcher<T | T1[], T1[]>(Array.isArray, compare, compareArray);
}

const compareOptionalSameTypeSchemaPrimitives = createOptionalComparator(
  compareSameTypeSchemaPrimitives
);

const compareOptionalSchemaValues =
  createOptionalComparator(compareSchemaValues);

const compareNonNullSchemaValue = createCmpMatcher(
  isSchemaPrimitiveExceptNull,
  createArrayOrItemComparator(
    createRecordsComparator(compareOptionalSchemaValues),
    createArrayComparator(compareSchemaValues)
  ),
  compareSchemaPrimitive
);

function compareSchemaValues(a: SchemaValue, b: SchemaValue): number {
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }
  return compareNonNullSchemaValue(a, b);
}

const compareArrayOfSameTypePrimitivesWithDeduplication =
  createArrayComparatorWithDeduplication(compareSameTypeSchemaPrimitives);

const compareSchemaDefinitions = createPairMatcher<
  JSONSchema7Definition,
  JSONSchema7,
  number
>(
  isSchemaObject,
  (a, b) => {
    const aKeys = Object.keys(a) as (keyof JSONSchema7)[];
    const bKeys = Object.keys(b) as (keyof JSONSchema7)[];
    const allKeys = insertUniqueValues(aKeys, bKeys);
    const l = allKeys.length;
    for (let i = 0; i < l; i++) {
      const key = allKeys[i]!;
      if (a[key] === b[key]) {
        continue;
      }
      const cmp = COMPARATORS[key] ?? compareOptionalSchemaValues;
      // @ts-expect-error
      const d = cmp(a[key], b[key]);
      if (d !== 0) {
        return d;
      }
    }
    return 0;
  },
  (a, b) => (b === true && isEmptyRecord(a) ? 0 : 1),
  (a, b) => (a === true && isEmptyRecord(b) ? 0 : -1),
  compareSameTypeSchemaPrimitives
);

const compareOptionalSchemaDefinitions = createOptionalComparator(
  compareSchemaDefinitions
);

const compareRecordOfOptionalSchemasWithEmptyRecordDefault =
  createNarrowingOptionalComparator(
    isEmptyRecord,
    createRecordsComparator(compareOptionalSchemaDefinitions)
  );

const compareNumbersWithZeroDefault = createNarrowingOptionalComparator(
  (v: number): v is 0 => v === 0,
  (a, b) => a - b
);

const compareOptionalArrayOfSchemasWithDeduplication = createOptionalComparator(
  createArrayComparatorWithDeduplication(compareSchemaDefinitions)
);

const compareSchemaDefinitionsWithEmptyDefinitionDefault =
  createNarrowingOptionalComparator(isAllowAnySchema, compareSchemaDefinitions);

const COMPARATORS: {
  [K in keyof JSONSchema7]-?: (a: JSONSchema7[K], b: JSONSchema7[K]) => number;
} = {
  $id: compareOptionalSameTypeSchemaPrimitives,
  $comment: compareOptionalSameTypeSchemaPrimitives,
  $defs: compareRecordOfOptionalSchemasWithEmptyRecordDefault,
  $ref: compareOptionalSameTypeSchemaPrimitives,
  $schema: compareOptionalSameTypeSchemaPrimitives,
  const: compareOptionalSchemaValues,
  contains: compareOptionalSchemaDefinitions,
  contentEncoding: compareOptionalSameTypeSchemaPrimitives,
  contentMediaType: compareOptionalSameTypeSchemaPrimitives,
  default: compareOptionalSchemaValues,
  definitions: compareRecordOfOptionalSchemasWithEmptyRecordDefault,
  description: compareOptionalSameTypeSchemaPrimitives,
  else: compareOptionalSchemaDefinitions,
  examples: compareOptionalSchemaValues,
  exclusiveMaximum: compareOptionalSameTypeSchemaPrimitives,
  exclusiveMinimum: compareOptionalSameTypeSchemaPrimitives,
  format: compareOptionalSameTypeSchemaPrimitives,
  if: compareOptionalSchemaDefinitions,
  maximum: compareOptionalSameTypeSchemaPrimitives,
  maxItems: compareOptionalSameTypeSchemaPrimitives,
  maxLength: compareOptionalSameTypeSchemaPrimitives,
  maxProperties: compareOptionalSameTypeSchemaPrimitives,
  minimum: compareOptionalSameTypeSchemaPrimitives,
  multipleOf: compareOptionalSameTypeSchemaPrimitives,
  not: compareOptionalSchemaDefinitions,
  pattern: compareOptionalSameTypeSchemaPrimitives,
  propertyNames: compareOptionalSchemaDefinitions,
  readOnly: compareOptionalSameTypeSchemaPrimitives,
  then: compareOptionalSchemaDefinitions,
  title: compareOptionalSameTypeSchemaPrimitives,
  writeOnly: compareOptionalSameTypeSchemaPrimitives,
  uniqueItems: createNarrowingOptionalComparator(
    (v): v is false => v === false,
    zero
  ),
  minLength: compareNumbersWithZeroDefault,
  minItems: compareNumbersWithZeroDefault,
  minProperties: compareNumbersWithZeroDefault,
  required: createNarrowingOptionalComparator(
    isEmptyArray,
    compareArrayOfSameTypePrimitivesWithDeduplication
  ),
  enum: createNarrowingOptionalComparator(
    isEmptyArray,
    createArrayComparatorWithDeduplication(compareSchemaValues)
  ),
  type: createOptionalComparator((a, b) => {
    const isAArr = Array.isArray(a);
    const isBArr = Array.isArray(b);
    if (!isAArr && !isBArr) {
      return compareSameTypeSchemaPrimitives(a, b);
    }
    return compareArrayOfSameTypePrimitivesWithDeduplication(
      isAArr ? a : [a],
      isBArr ? b : [b]
    );
  }),
  items: createNarrowingOptionalComparator(
    (v): v is true | JSONSchema7 => !Array.isArray(v) && isAllowAnySchema(v),
    createArrayOrItemComparator(
      compareSchemaDefinitions,
      createArrayComparator(compareSchemaDefinitions)
    )
  ),
  anyOf: compareOptionalArrayOfSchemasWithDeduplication,
  allOf: compareOptionalArrayOfSchemasWithDeduplication,
  oneOf: compareOptionalArrayOfSchemasWithDeduplication,
  properties: compareRecordOfOptionalSchemasWithEmptyRecordDefault,
  patternProperties: compareRecordOfOptionalSchemasWithEmptyRecordDefault,
  additionalProperties: compareSchemaDefinitionsWithEmptyDefinitionDefault,
  additionalItems: compareSchemaDefinitionsWithEmptyDefinitionDefault,
  dependencies: createNarrowingOptionalComparator(
    isEmptyRecord,
    createRecordsComparator(
      createOptionalComparator(
        createArrayOrItemComparator(
          compareSchemaDefinitions,
          compareArrayOfSameTypePrimitivesWithDeduplication
        )
      )
    )
  ),
};

export function isEqual(a: JSONSchema7Definition, b: JSONSchema7Definition) {
  return compareSchemaDefinitions(a, b) === 0;
}
