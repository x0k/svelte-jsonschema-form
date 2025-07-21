import type {
  JSONSchema7Type as SchemaValue,
  JSONSchema7TypeName as SchemaType,
} from "json-schema";

import { isSchema, type Schema, type SchemaDefinition } from "../schema.js";

const constZero = () => 0;

const isEmptyArray = <T>(arr: T[]): arr is [] => arr.length === 0;

const isEmptyRecord = <R extends Record<string, any>>(
  rec: R | Record<string, never>
): rec is Record<string, never> => {
  for (const key in rec) {
    if (rec.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

const isEmptySchemaDef = (
  def: SchemaDefinition
): def is true | Record<string, never> =>
  isSchema(def) ? isEmptyRecord(def) : def === true;

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
      if (a[i] === b[i]) {
        continue;
      }
      const d = compare(a[i]!, b[i]!);
      if (d !== 0) {
        return d;
      }
    }
    return 0;
  };
}

function deduplicate<T>(arr: T[], compare: (a: T, b: T) => number) {
  const sorted = arr.toSorted(compare);
  let shift = 0;
  for (let i = 1; i < arr.length; i++) {
    if (compare(sorted[i - 1]!, sorted[i]!) === 0) {
      shift++;
    } else {
      sorted[i - shift] = sorted[i]!;
    }
  }
  sorted.length -= shift;
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
    const aKeysSet = new Set(aKeys);
    const uniqKeys = aKeys.concat(bKeys.filter((k) => !aKeysSet.has(k))).sort();
    for (const key of uniqKeys) {
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

function createNarrowingComparator<T, E extends T>(
  isEmpty: (v: T) => v is E,
  compare: (l: Exclude<T, E>, r: Exclude<T, E>) => number,
  compareEmpty: (l: E, r: E) => number = constZero
) {
  return (a: T, b: T) => {
    if (isEmpty(a)) {
      if (isEmpty(b)) {
        return compareEmpty(a, b);
      }
      return -1;
    }
    if (isEmpty(b)) {
      return 1;
    }
    return compare(a as Exclude<T, E>, b as Exclude<T, E>);
  };
}

function createOptionalComparator<T>(compare: (l: T, r: T) => number) {
  return createNarrowingComparator(
    (v: T | undefined): v is undefined => v === undefined,
    compare
  );
}

function createNarrowingOptionalComparator<T, E extends T>(
  isEmpty: (v: T) => v is E,
  compare: (
    l: Exclude<T, E | undefined>,
    r: Exclude<T, E | undefined>
  ) => number
) {
  return createNarrowingComparator<T | undefined, E | undefined>(
    (v: T | undefined): v is undefined | E => v === undefined || isEmpty(v),
    compare
  );
}

function createArrayOrItemComparator<T, T1>(
  compare: (a: T, b: T) => number,
  compareArray: (a: T1[], b: T1[]) => number
) {
  return createNarrowingComparator<T | T1[], T1[]>(
    Array.isArray,
    compare,
    compareArray
  );
}

const compareOptionalSameTypeSchemaPrimitives = createOptionalComparator(
  compareSameTypeSchemaPrimitives
);

const compareOptionalSchemaValues =
  createOptionalComparator(compareSchemaValues);

const compareNonNullSchemaValue = createNarrowingComparator(
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

function compareSchemaDefinitions(
  a: SchemaDefinition,
  b: SchemaDefinition
): number {
  if (a === b) {
    return 0;
  }
  const isASchema = isSchema(a);
  const isBSchema = isSchema(b);
  if (!isASchema) {
    if (!isBSchema) {
      return compareSameTypeSchemaPrimitives(a, b);
    }
    return a === true && isEmptyRecord(b) ? 0 : -1;
  }
  if (!isBSchema) {
    return b === true && isEmptyRecord(a) ? 0 : 1;
  }
  let keys = Object.keys(a) as (keyof Schema)[];
  const bClone = { ...b };
  do {
    for (const key of keys) {
      delete bClone[key];
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
    keys = Object.keys(bClone) as (keyof Schema)[];
  } while (keys.length);
  return 0;
}

const compareSchemaDefinitionsWithEmptyDefinitionDefault =
  createNarrowingOptionalComparator(isEmptySchemaDef, compareSchemaDefinitions);

const COMPARATORS: {
  [K in keyof Schema]-?: (a: Schema[K], b: Schema[K]) => number;
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
  discriminator: createOptionalComparator((a, b) =>
    compareSameTypeSchemaPrimitives(a.propertyName, b.propertyName)
  ),
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
    constZero
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
    (v): v is true | Schema => !Array.isArray(v) && isEmptySchemaDef(v),
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

export function isEqual(a: SchemaDefinition, b: SchemaDefinition) {
  return compareSchemaDefinitions(a, b) === 0;
}
