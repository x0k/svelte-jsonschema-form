import { getValueByKeys, insertValue, type Trie } from "@/lib/trie.js";
import { unique } from "@/lib/array.js";
import { lcm } from "@/lib/math.js";

import {
  isSchema,
  isTruthySchemaDefinition,
  type Schema,
  type SchemaDefinition,
} from "../schema.js";
import { createConditionMapper, insertUniqueValues } from "./shared.js";

type SchemaKey = keyof Schema;

function last<T>(_: T, r: T) {
  return r;
}

function mergeArraysWithUniq<T>(l: T[], r: T[]) {
  return unique(l.concat(r));
}

function getCombinations<T>(l: T[], r: T[]): [T, T][] {
  const combinations: [T, T][] = [];
  for (const left of l) {
    for (const right of r) {
      combinations.push([left, right]);
    }
  }
  return combinations;
}

function mergeBooleans(l: boolean, r: boolean) {
  return l || r;
}

function mergePatterns(a: string, b: string) {
  return a === b ? a : `(?=${a})(?=${b})`;
}

function createRecordsMerge<T>(merge: (l: T, r: T) => T) {
  return (left: Record<string, T>, right: Record<string, T>) => {
    const target = { ...left };
    const keys = Object.keys(right);
    const l = keys.length;
    for (let i = 0; i < l; i++) {
      const key = keys[i]!;
      target[key] =
        left[key] === undefined ? right[key]! : merge(left[key], right[key]!);
    }
    return target;
  };
}

type Assigner<R extends {}> = (target: R, l: R, r: R) => void;

function createAssignersTrie(
  assigners: Iterable<[SchemaKey[], Assigner<Schema>]>
) {
  let trie: Trie<string, Assigner<Schema>> = undefined;
  for (const pair of assigners) {
    for (const key of pair[0]) {
      trie = insertValue(trie, key, pair[1]);
    }
  }
  return trie;
}

function assignAdditional(
  target: Schema,
  key: "Items" | "Properties",
  additional: SchemaDefinition | undefined
) {
  const k = `additional${key}` as const;
  if (additional === undefined || isTruthySchemaDefinition(additional)) {
    delete target[k];
  } else {
    target[k] = additional;
  }
}

const PROPERTIES_ASSIGNER_KEYS = [
  "properties",
  "patternProperties",
  "additionalProperties",
] as const satisfies SchemaKey[];

const propertiesAssigner: Assigner<Schema> = (
  target,
  {
    properties: lProps = {},
    patternProperties: lPatterns,
    additionalProperties: lAdditional,
  },
  {
    properties: rProps = {},
    patternProperties: rPatterns,
    additionalProperties: rAdditional,
  }
) => {
  const isLAddFalse = lAdditional === false;
  const isRAddFalse = rAdditional === false;
  let properties: Record<string, SchemaDefinition> | undefined;
  let patterns: Record<string, SchemaDefinition> | undefined;
  if (isLAddFalse && isRAddFalse) {
    const lKeys = Object.keys(lProps);
    const rKeys = Object.keys(rProps);
    if (lKeys.length > 0) {
      if (rKeys.length > 0) {
        properties = {};
        const keys = insertUniqueValues(lKeys, rKeys);
        const l = keys.length;
        for (let i = 0; i < l; i++) {
          const key = keys[i]!;
          properties[key] = mergeSchemaDefinitions(lProps[key]!, rProps[key]!);
        }
      } else {
        properties = lProps;
      }
    } else if (rKeys.length > 0) {
      properties = rProps;
    }
    patterns =
      lPatterns && rPatterns
        ? mergeRecordsOfSchemaDefinitions(lPatterns, rPatterns)
        : (lPatterns ?? rPatterns);
  } else if (isLAddFalse || isRAddFalse) {
    // TODO: Merge patterns schemas into properties
  } else {
    properties = mergeRecordsOfSchemaDefinitions(lProps, rProps);
  }
  if (properties) {
    target.properties = properties;
  } else {
    delete target.properties;
  }
  if (patterns) {
    target.patternProperties = patterns;
  } else {
    delete target.patternProperties;
  }
  assignAdditional(
    target,
    "Properties",
    lAdditional !== undefined && rAdditional !== undefined
      ? mergeSchemaDefinitions(lAdditional, rAdditional)
      : (lAdditional ?? rAdditional)
  );
};

const ITEMS_ASSIGNER_KEYS = [
  "items",
  "additionalItems",
] as const satisfies SchemaKey[];

const itemsAssigner: Assigner<Schema> = (
  target,
  // NOTE: Schema that has `additionalItems` without an `items` keyword is invalid
  // so the assigner should be triggered only be colliding `items` properties
  // so default values are used only for type narrowing
  { items: lItems = [], additionalItems: lAdditional },
  { items: rItems = [], additionalItems: rAdditional }
) => {
  const isLArr = Array.isArray(lItems);
  const isRArr = Array.isArray(rItems);
  let itemsArray: SchemaDefinition[] = [];
  target.items = itemsArray;
  if (isLArr && isRArr) {
    const [l, additional, tail] =
      lItems.length < rItems.length
        ? [lItems.length, lAdditional, rItems]
        : [rItems.length, rAdditional, lItems];
    let i = 0;
    for (; i < l; i++) {
      itemsArray.push(mergeSchemaDefinitions(lItems[i]!, rItems[i]!));
    }
    if (additional === false) {
      target.additionalItems = false;
    } else {
      const isAdditionalTruthy =
        additional === undefined || isTruthySchemaDefinition(additional);
      for (; i < tail.length; i++) {
        itemsArray.push(
          isAdditionalTruthy
            ? tail[i]!
            : mergeSchemaDefinitions(tail[i]!, additional)
        );
      }
      assignAdditional(
        target,
        "Items",
        lAdditional !== undefined && rAdditional !== undefined
          ? mergeSchemaDefinitions(lAdditional, rAdditional)
          : (lAdditional ?? rAdditional)
      );
    }
  } else if (isLArr || isRArr) {
    const [arr, item, additional] = (
      isLArr ? [lItems, rItems, lAdditional] : [rItems, lItems, rAdditional]
    ) as [SchemaDefinition[], SchemaDefinition, SchemaDefinition | undefined];
    assignAdditional(target, "Items", additional);
    for (let i = 0; i < arr.length; i++) {
      itemsArray.push(mergeSchemaDefinitions(arr[i]!, item));
    }
  } else {
    delete target.additionalItems;
    target.items = mergeSchemaDefinitions(lItems, rItems);
  }
};

const CONDITION_ASSIGNER_KEYS = [
  "if",
  "then",
  "else",
] as const satisfies SchemaKey[];

const conditionAssigner: Assigner<Schema> = (target, l, r) => {};

const ASSIGNERS_TRIE = createAssignersTrie([
  [PROPERTIES_ASSIGNER_KEYS, propertiesAssigner],
  [ITEMS_ASSIGNER_KEYS, itemsAssigner],
  [CONDITION_ASSIGNER_KEYS, conditionAssigner],
]);

type Merger<T> = (a: T, b: T) => T;

function mergeCombinations(l: SchemaDefinition[], r: SchemaDefinition[]) {
  return getCombinations(l, r).map(mergeAllOfSchemas);
}

function mergeSchemas(left: Schema, right: Schema): Schema {
  const assigners = new Set<Assigner<Schema>>();
  const target = { ...left };
  const keys = Object.keys(right) as SchemaKey[];
  const l = keys.length;
  for (let i = 0; i < l; i++) {
    const key = keys[i]!;
    const rv = right[key];
    if (rv === undefined) {
      continue;
    }
    const lv = left[key];
    if (lv === undefined) {
      // @ts-expect-error
      target[key] = value;
      continue;
    }
    const assign = getValueByKeys(ASSIGNERS_TRIE, key);
    if (assign) {
      assigners.add(assign);
      continue;
    }
    const merge = MERGERS[key as keyof typeof MERGERS];
    if (merge) {
      // @ts-expect-error
      target[key] = merge(lv, value);
    }
  }
  for (const assign of assigners) {
    assign(target, left, right);
  }
  return target;
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

const mergeRecordsOfSchemaDefinitions = createRecordsMerge(
  mergeSchemaDefinitions
);

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

type AssignerKey =
  | (typeof PROPERTIES_ASSIGNER_KEYS)[number]
  | (typeof ITEMS_ASSIGNER_KEYS)[number]
  | (typeof CONDITION_ASSIGNER_KEYS)[number];

const MERGERS: {
  [K in Exclude<SchemaKey, AssignerKey>]-?: Merger<
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
      return a;
    }
    const isAArr = Array.isArray(a);
    const isBArr = Array.isArray(b);
    if (!isAArr && !isBArr) {
      return [a, b];
    }
    return mergeArraysWithUniq(isAArr ? a : [a], isBArr ? b : [b]);
  },
  default: last,
  description: last,
  title: last,
  const: last,
  format: last,
  contentEncoding: last,
  contentMediaType: last,
  discriminator: last,
  // TODO: Perform equality check to simplify result
  not: (a, b) => ({ anyOf: [a, b] }),
  pattern: mergePatterns,
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
  dependencies: createRecordsMerge(mergeSchemaDefinitionsOrArrayOfString),
  examples: (l, r) => {
    // https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-10.4
    if (!Array.isArray(l) || !Array.isArray(r)) {
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
