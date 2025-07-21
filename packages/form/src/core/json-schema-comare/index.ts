import type {
  JSONSchema7Object,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from "json-schema";
import {
  DEPENDENCIES_KEY,
  isSchema,
  isSubSchemaKey,
  isSubSchemasArrayKey,
  isSubSchemasRecordKey,
  ITEMS_KEY,
  type Schema,
  type SchemaArrayValue,
  type SchemaDefinition,
} from "../schema.js";

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

function* allUniqKeys<T>(mutableUniqItems: T[], mutableOtherItems: T[]) {
  const seen = new Set<T>();
  for (const k of mutableUniqItems.sort()) {
    seen.add(k);
    yield k;
  }
  for (const k of mutableOtherItems.sort()) {
    if (!seen.has(k)) {
      yield k;
    }
  }
}

function createRecordsComparator<T>(compare: (l: T, r: T) => number) {
  return (a: Record<string, T>, b: Record<string, T>) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const d = aKeys.length - bKeys.length;
    if (d !== 0) {
      return d;
    }
    for (const key of allUniqKeys(aKeys, bKeys)) {
      const l = a[key];
      const r = b[key];
      if (l === r) {
        continue;
      }
      if (l === undefined) {
        return -1;
      }
      if (r === undefined) {
        return 1;
      }
      const d = compare(l, r);
      if (d !== 0) {
        return d;
      }
    }
    return 0;
  };
}

function createArrayOrItemComparator<T, T1>(
  compare: (a: T, b: T) => number,
  compareArray: (a: T1[], b: T1[]) => number
) {
  return (a: T | T1[], b: T | T1[]) => {
    const isAArr = Array.isArray(a);
    const isBArr = Array.isArray(b);
    if (isAArr) {
      if (isBArr) {
        return compareArray(a, b);
      }
      return 1;
    }
    if (isBArr) {
      return -1;
    }
    return compare(a, b);
  };
}

function createArrayComparator<T>(compare: (a: T, b: T) => number) {
  return (a: T[], b: T[]) => {
    a = deduplicate(a, compare);
    b = deduplicate(b, compare);
    const d = a.length - b.length;
    if (d !== 0) {
      return d;
    }
    for (let i = 0; i < a.length; i++) {
      const d = compare(a[i]!, b[i]!);
      if (d !== 0) {
        return d;
      }
    }
    return 0;
  };
}

function comparePrimitive<T>(a: T, b: T) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

type SchemaPrimitiveTypeExceptNullType = Extract<
  JSONSchema7TypeName,
  "string" | "number" | "boolean"
>;
type SchemaPrimitiveTypeExceptNull = string | number | boolean;

const isSchemaPrimitiveExceptNull = (
  value: JSONSchema7Type
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

function compareSchemaPrimitive(
  a: SchemaPrimitiveTypeExceptNull,
  b: SchemaPrimitiveTypeExceptNull
) {
  const ta = typeof a as SchemaPrimitiveTypeExceptNullType;
  const tb = typeof b as SchemaPrimitiveTypeExceptNullType;
  return ta === tb
    ? comparePrimitive(a, b)
    : CMP_TABLE[PRIMITIVE_TYPE_ORDER[ta]][PRIMITIVE_TYPE_ORDER[tb]];
}

const compareSchemaObjects = createArrayOrItemComparator(
  createRecordsComparator(compareSchemaValue),
  createArrayComparator(compareSchemaValue)
);

function compareSchemaValue(a: JSONSchema7Type, b: JSONSchema7Type) {
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }
  if (isSchemaPrimitiveExceptNull(a)) {
    if (isSchemaPrimitiveExceptNull(b)) {
      return compareSchemaPrimitive(a, b);
    }
    return -1;
  }
  if (isSchemaPrimitiveExceptNull(b)) {
    return 1;
  }
  return compareSchemaObjects(a, b);
}

const compareArrayOfPrimitives = createArrayComparator(comparePrimitive);

const compareSchemaOrArrayOfPrimitives = createArrayOrItemComparator(
  compare,
  compareArrayOfPrimitives
);

const compareArrayOfSchemas = createArrayComparator(compare);

const compareSchemaOrArrayOfSchemas = createArrayOrItemComparator(
  compare,
  compareArrayOfSchemas
);

function compareNumbers(a: number | undefined, b: number | undefined) {
  if (a === undefined) {
    if (b === 0) {
      return 0;
    }
    return -1;
  }
  if (b === undefined) {
    if (a === 0) {
      return 0;
    }
    return 1;
  }
  return a - b;
}

function createArraysComparator<T>(compare: (a: T[], b: T[]) => number) {
  return (a: T[] | undefined, b: T[] | undefined) => {
    if (a === undefined) {
      if (b!.length === 0) {
        return 0;
      }
      return -1;
    }
    if (b === undefined) {
      if (a!.length === 0) {
        return 0;
      }
      return 1;
    }
    return compare(a, b);
  };
}

const COMPARATORS: {
  [K in keyof Schema]: (a: Schema[K], b: Schema[K]) => number;
} = {
  uniqueItems: (a, b) => {
    if (a === undefined) {
      if (b === false) {
        return 0;
      }
      return -1;
    }
    if (b === undefined) {
      if (a === false) {
        return 0;
      }
      return 1;
    }
    return 0;
  },
  minLength: compareNumbers,
  minItems: compareNumbers,
  minProperties: compareNumbers,
  required: createArraysComparator(comparePrimitive),
  enum: createArraysComparator(compareSchemaValue),
  type: (a, b) => {},
};

function compare(a: SchemaDefinition, b: SchemaDefinition): number {
  if (a === b) {
    return 0;
  }
  const aKeys = Object.keys(a) as (keyof Schema)[];
  if (b === true && aKeys.length === 0) {
    return 0;
  }
  const bKeys = Object.keys(b) as (keyof Schema)[];
  if (a === true && bKeys.length === 0) {
    return 0;
  }
  if (!isSchema(a)) {
    return -1;
  }
  if (!isSchema(b)) {
    return 1;
  }
  for (const key of allUniqKeys(aKeys, bKeys)) {
    if (a[key] === b[key]) {
      continue;
    }
    const cmp = COMPARATORS[key] ?? compareSchemaValue;
    if (key === ITEMS_KEY) {
      const l = a[key];
      const r = b[key];
      if (l === undefined) {
        if (Array.isArray(r) || Object.keys(r!).length > 0) {
          return -1;
        }
        continue;
      }
      if (r === undefined) {
        if (Array.isArray(l) || Object.keys(l!).length > 0) {
          return 1;
        }
        continue;
      }
      return compareSchemaOrArrayOfSchemas(l, r);
    } else if (key === DEPENDENCIES_KEY) {
      const l = a[key];
      const r = b[key];
      if (l === undefined) {
        if (Object.keys(r!).length > 0) {
          return -1;
        }
        continue;
      }
      if (r === undefined) {
        if (Object.keys(l!).length > 0) {
          return 1;
        }
        continue;
      }
      return createRecordsComparator(l, r, compareSchemaOrArrayOfPrimitives);
    } else if (isSubSchemaKey(key)) {
      const l = a[key] ?? true;
      const r = b[key] ?? true;
      const d = compare(l, r);
      if (d !== 0) {
        return d;
      }
    } else if (isSubSchemasArrayKey(key)) {
      let l = a[key];
      let r = b[key];
      if (l === undefined) {
        return -1;
      }
      if (r === undefined) {
        return 1;
      }
      l = deduplicate(l, compare);
      r = deduplicate(r, compare);
      const d = l.length - r.length;
      if (d !== 0) {
        return d;
      }
      for (let i = 0; i < l.length; i++) {
        const d = compare(l[i]!, r[i]!);
        if (d !== 0) {
          return d;
        }
      }
    } else if (isSubSchemasRecordKey(key)) {
      const l = a[key];
      const r = b[key];
      if (l === undefined) {
        return -1;
      }
      if (r === undefined) {
        return 1;
      }
      return createRecordsComparator(l, r, compare);
    } else if (key === "uniqueItems") {
      const l = a[key];
      const r = b[key];
      if (l === undefined) {
        if (r === false) {
          continue;
        }
        return -1;
      }
      if (r === undefined) {
        if (l === false) {
          continue;
        }
        return 1;
      }
      throw new Error(
        `Impossible 'uniqueItems' state: ${JSON.stringify({ l, r })}`
      );
    } else if (
      key === "minLength" ||
      key === "minItems" ||
      key === "minProperties"
    ) {
    }
  }
  return 0;
}
