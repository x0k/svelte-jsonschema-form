import { unique } from "@/lib/array.js";
import { lcm } from "@/lib/math.js";

import {
  isSchema,
  isTruthySchemaDefinition,
  type Schema,
  type SchemaDefinition,
} from "../schema.js";
import { isSchemaArrayValue } from "../value.js";
import { createConditionMapper } from "./shared.js";

function last<T>(_: T, r: T) {
  return r;
}

function mergeArraysWithUniq<T>(l: T[], r: T[]) {
  return unique(l.concat(r));
}

function getCombinations<T>(l: T[], r: T[]) {
  const combinations = [];
  for (const left of l) {
    for (const right of r) {
      combinations.push([left, right]);
    }
  }
  return combinations;
}

function mergeBooleans(l: boolean, r: boolean) {
  return l || r
}

function mergeRecords<T>(
  left: Record<string, T>,
  right: Record<string, T>,
  merge: (l: T, r: T) => T
) {
  const target = Object.assign({}, left);
  for (const [key, value] of Object.entries(right)) {
    if (left[key] === undefined) {
      target[key] = value;
      continue;
    }
    target[key] = merge(left[key], value);
  }
  return target;
}

type Assigner<R extends {}, T extends R[keyof R]> = (
  target: R,
  l: T,
  r: T
) => void;

type Merger<T> = (a: T, b: T) => T;

function mergeCombinations(l: SchemaDefinition[], r: SchemaDefinition[]) {
  return getCombinations(l, r).map(mergeAllOfSchemas);
}

function mergeSchemas(left: Schema, right: Schema): Schema {
  const merged = Object.assign({}, left, right);
  for (const key of Object.keys(left)) {
    if (key in right) {
      const lv = left[key as keyof Schema];
      if (lv !== undefined) {
        const rv = right[key as keyof Schema];
        if (rv === undefined) {
          // @ts-expect-error
          merged[key] = lv;
        } else {
          // @ts-expect-error
          merged[key] = (MERGERS[key] ?? last)(lv, rv);
        }
      }
    }
  }
  return merged;
}

const mergeSchemaOrTrue = createConditionMapper<
  true | Schema,
  true | Record<string, never>,
  true | Schema
>(
  isTruthySchemaDefinition,
  () => true,
  (_, r) => r,
  (l) => l,
  mergeSchemas
);

function mergeSchemaDefinitions(l: SchemaDefinition, r: SchemaDefinition) {
  if (l === false || r === false) {
    return false;
  }
  return mergeSchemaOrTrue(l, r);
}

function mergeRecordsOfSchemaDefinitions(
  l: Record<string, SchemaDefinition>,
  r: Record<string, SchemaDefinition>
) {
  return mergeRecords(l, r, mergeSchemaDefinitions);
}

const mergeSchemaDefinitionsOrArrayOfString = createConditionMapper<
  SchemaDefinition | string[],
  string[],
  SchemaDefinition | string[]
>(
  Array.isArray,
  mergeArraysWithUniq,
  (l, r) => mergeSchemaDefinitions({ required: l }, r),
  (l, r) => mergeSchemaDefinitions(l, { required: r }),
  mergeSchemaDefinitions
);

function mergeRecordsOfSchemaDefinitionsOrArrayOfString(
  l: Record<string, SchemaDefinition | string[]>,
  r: Record<string, SchemaDefinition | string[]>
) {
  return mergeRecords(l, r, mergeSchemaDefinitionsOrArrayOfString);
}

type PropertiesResolverKey =
  | "properties"
  | "patternProperties"
  | "additionalProperties";
type ItemsResolverKey = "items" | "additionalItems";
type ConditionResolverKey = "if" | "then" | "else";
type ComplexResolverKey =
  | PropertiesResolverKey
  | ItemsResolverKey
  | ConditionResolverKey;

const MERGERS: {
  [K in Exclude<keyof Schema, ComplexResolverKey>]-?: Merger<
    Exclude<Schema[K], undefined>
  >;
} = {
  $id: last,
  $ref: last,
  $schema: last,
  $comment: last,
  $defs: mergeRecordsOfSchemaDefinitions,
  type: (a, b) => {
    if (a === b) {
      return a
    }
    const isAArr = Array.isArray(a);
    const isBArr = Array.isArray(b);
    if (!isAArr && !isBArr) {
      return [a, b]
    }
    return mergeArraysWithUniq(
      isAArr ? a : [a],
      isBArr ? b : [b]
    )
  },
  default: last,
  description: last,
  title: last,
  const: last,
  format: last,
  contentEncoding: last,
  contentMediaType: last,
  discriminator: last,
  // TODO: Equality check to result
  not: (a, b) => ({ anyOf: [a, b] }),
  pattern: (a, b) => (a === b ? a : `(?=${a})(?=${b})`),
  readOnly: mergeBooleans,
  writeOnly: mergeBooleans,
  // TODO: Proper deduplication
  enum: mergeArraysWithUniq,
  anyOf: mergeCombinations,
  oneOf: mergeCombinations,
  // TODO: Proper deduplication
  allOf: (l, r) => l.concat(r),
  propertyNames: mergeSchemaDefinitions,
  contains: mergeSchemaDefinitions,
  definitions: mergeRecordsOfSchemaDefinitions,
  dependencies: mergeRecordsOfSchemaDefinitionsOrArrayOfString,
  examples: (l, r) => {
    // https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-10.4
    if (!isSchemaArrayValue(l) || !isSchemaArrayValue(r)) {
      throw new Error(
        `Value of the 'examples' field should be an array, but got "${JSON.stringify(l)}" and "${JSON.stringify(r)}"`
      );
    }
    // TODO: Proper deduplication
    return mergeArraysWithUniq(l, r);
  },
  multipleOf: (a, b) => {
    let factor = 1;
    while (!Number.isInteger(a) || !Number.isInteger(b)) {
      factor *= 10;
      a *= 10;
      b *= 10;
    }
    return lcm(a, b) / factor;
  },
  exclusiveMaximum: Math.min,
  maximum: Math.min,
  maxItems: Math.min,
  maxLength: Math.min,
  maxProperties: Math.min,
  exclusiveMinimum: Math.max,
  minimum: Math.max,
  minItems: Math.max,
  minLength: Math.max,
  minProperties: Math.max,
  required: mergeArraysWithUniq,
  uniqueItems: mergeBooleans,
};

export function getAllOfSchemas(schema: SchemaDefinition): SchemaDefinition[] {
  if (!isSchema(schema) || schema.allOf === undefined) {
    return [schema];
  }
  const { allOf, ...rest } = schema;
  const array = allOf.flatMap((s) => getAllOfSchemas(s));
  array.push(rest);
  return array;
}

function mergeAllOfSchemas(schemas: SchemaDefinition[]): SchemaDefinition {
  let wIndex = 0;
  for (let i = 0; i < schemas.length; i++) {
    const item = schemas[i]!;
    if (item === false) {
      return false;
    }
    if (!isTruthySchemaDefinition(item)) {
      if (wIndex !== i) {
        schemas[wIndex] = item;
      }
      wIndex++;
    }
  }
  if (wIndex === 0) {
    return schemas[0]!;
  }
  let result = schemas[0] as Schema;
  for (let i = 1; i < wIndex; i++) {
    result = mergeSchemas(result, schemas[i] as Schema);
  }
  return result;
}

export function mergeAllOf(schema: Schema) {
  return mergeAllOfSchemas(getAllOfSchemas(schema));
}
