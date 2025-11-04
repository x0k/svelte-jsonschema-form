import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from "json-schema";

import {
  intersection,
  union,
  type Deduplicator,
  type Intersector,
} from "@/lib/array.js";
import { identity } from "@/lib/function.js";
import { isAllowAnySchema } from "@/lib/json-schema/index.js";
import { lcm } from "@/lib/math.js";

import { simplePatternsMerger } from "./patterns.js";

type SchemaKey = keyof JSONSchema7;

function* createPairCombinations<T, R>(
  l: T[],
  r: T[],
  action: (a: T, b: T) => R
) {
  const ll = l.length;
  const rl = r.length;
  if (ll > 0 && rl > 0) {
    for (let i = 0; i < ll; i++) {
      const lv = l[i]!;
      for (let j = 0; j < rl; j++) {
        yield action(lv, r[j]!);
      }
    }
  }
}

function mergeBooleans(l: boolean, r: boolean) {
  return l || r;
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

/**
 * An assigner function operates at the schema-object level.
 * It receives the partially merged `target` and the original
 * `left` and `right` schemas.
 *
 * In most cases, it modifies and returns the `target` object,
 * but it may also return a completely new schema object if needed.
 *
 * Assigners are used for keywords that cannot be merged by simple
 * value-level functions, often because they interact with other
 * keywords or require holistic decisions.
 */
export type Assigner<R extends {}> = (target: R, l: R, r: R) => R;

function createAssignersMap(
  assigners: Iterable<[SchemaKey[], Assigner<JSONSchema7>]>
) {
  const map = new Map<SchemaKey, Assigner<JSONSchema7>>();
  for (const pair of assigners) {
    for (const key of pair[0]) {
      map.set(key, pair[1]);
    }
  }
  return map;
}

function assignSchemaDefinitionOrRecordOfSchemaDefinitions<
  K extends {
    [T in SchemaKey]: JSONSchema7[T] extends
      | JSONSchema7Definition
      | Record<string, JSONSchema7Definition>
      | undefined
      ? T
      : never;
  }[SchemaKey],
>(target: JSONSchema7, key: K, value: JSONSchema7[K]) {
  if (value === undefined || isAllowAnySchema(value)) {
    delete target[key];
  } else {
    target[key] = value;
  }
}

const PROPERTIES_ASSIGNER_KEYS = [
  "properties",
  "patternProperties",
  "additionalProperties",
] as const satisfies SchemaKey[];

interface CompiledPattern {
  regExp: RegExp;
  schema: JSONSchema7Definition;
}

function compilePatterns(patterns: Record<string, JSONSchema7Definition>) {
  const keys = Object.keys(patterns);
  const l = keys.length;
  const result: CompiledPattern[] = [];
  for (let i = 0; i < l; i++) {
    const source = keys[i]!;
    result.push({
      regExp: new RegExp(source),
      schema: patterns[source]!,
    });
  }
  return [result, keys] as const;
}

const EMPTY_PATTERNS_AND_KEYS: [CompiledPattern[], string[]] = [[], []];

/**
 * @returns `true` when `false` schema occurred
 */
function appendKeyConstraints(
  target: (JSONSchema7 | true)[],
  key: string,
  patterns: CompiledPattern[]
): boolean {
  const l = patterns.length;
  for (let i = 0; i < l; i++) {
    const p = patterns[i]!;
    if (!p.regExp.test(key)) {
      continue;
    }
    const s = p.schema;
    if (s === false) {
      return true;
    }
    target.push(s);
  }
  return false;
}

const ITEMS_ASSIGNER_KEYS = [
  "items",
  "additionalItems",
] as const satisfies SchemaKey[];

const CONDITION_ASSIGNER_KEYS = [
  "if",
  "then",
  "else",
] as const satisfies SchemaKey[];

function assignCondition(target: JSONSchema7, source: JSONSchema7) {
  if (source.if !== undefined) {
    target.if = source.if;
  }
  if (source.then !== undefined) {
    target.then = source.then;
  }
  if (source.else !== undefined) {
    target.else = source.else;
  }
  return target;
}

type AssignerKey =
  | (typeof PROPERTIES_ASSIGNER_KEYS)[number]
  | (typeof ITEMS_ASSIGNER_KEYS)[number]
  | (typeof CONDITION_ASSIGNER_KEYS)[number];

function intersectSchemaTypes(
  a: JSONSchema7TypeName,
  b: JSONSchema7TypeName
): JSONSchema7TypeName | undefined {
  if (a === b) {
    return a;
  }
  switch (a) {
    case "number": {
      if (b === "integer") {
        return "integer";
      }
    }
    // eslint-disable-next-line no-fallthrough
    case "integer": {
      if (b === "number") {
        return "integer";
      }
    }
    // eslint-disable-next-line no-fallthrough
    default:
      return undefined;
  }
}

/**
 * A merger function combines two values for a specific JSON Schema keyword.
 */
export type Merger<T> = (a: T, b: T) => T;

/**
 * A validation function that ensures consistency between two schema keywords.
 */
export type Check<K extends SchemaKey> = (
  target: Required<Pick<JSONSchema7, K>>
) => boolean;

export type CheckEntry<A extends SchemaKey, B extends SchemaKey> = readonly [
  A,
  B,
  Check<A | B>,
];

export function check<A extends SchemaKey, B extends SchemaKey>(
  a: A,
  b: B,
  check: Check<A | B>
): CheckEntry<A, B> {
  return [a, b, check];
}

function createChecksMap(checks: Iterable<CheckEntry<SchemaKey, SchemaKey>>) {
  const map = new Map<
    SchemaKey,
    { oppositeKey: SchemaKey; check: (target: JSONSchema7) => void }[]
  >();
  for (const [a, b, check] of checks) {
    const fn = (target: JSONSchema7) => {
      if (!check(target as Required<JSONSchema7>)) {
        throw new Error(
          `Schema keys '${a}' and '${b}' are conflicting (${a}: ${JSON.stringify(target[a])}, ${b}: ${JSON.stringify(target[b])})`
        );
      }
    };
    for (const k of [
      [a, b],
      [b, a],
    ]) {
      let arr = map.get(k[0]!);
      if (arr === undefined) {
        arr = [];
        map.set(k[0]!, arr);
      }
      arr.push({ oppositeKey: k[1]!, check: fn });
    }
  }
  return map;
}

export interface MergeOptions {
  /**
   * Custom function to test whether a regular expression `subExpr`
   * is considered a subset of another `superExpr`.
   * @default Object.is
   */
  isSubRegExp?: (subExpr: string, superExpr: string) => boolean;

  /**
   * Merger function for combining regular expression patterns
   * @default simplePatternsMerger
   */
  mergePatterns?: Merger<string>;

  /**
   * Intersector function for merging JSON values (enum keyword)
   * @default intersection
   */
  intersectJson?: Intersector<JSONSchema7Type>;

  /**
   * Deduplication strategy for JSON Schema definitions.
   * @default identity
   */
  deduplicateJsonSchemaDef?: Deduplicator<JSONSchema7Definition>;

  /**
   * Fallback merger applied when no keyword-specific merger is defined.
   * @default identity
   */
  defaultMerger?: Merger<any>;

  /**
   * A mapping of schema keywords to merger functions.
   *
   * - A merger operates on **values of a single keyword** (`a`, `b` → merged value).
   * - When provided, a custom merger **overrides the default merger** for that keyword.
   */
  mergers?: Partial<{
    [K in SchemaKey]: Merger<Exclude<JSONSchema7[K], undefined>>;
  }>;

  /**
   * A collection of keyword groups with associated assigner functions.
   *
   * - An assigner operates at the **schema-object level** (`target`, `left`, `right`).
   * - Custom assigners are **appended** to the default assigners,
   *   but can also **replace behavior** for specific keywords if they overlap.
   */
  assigners?: Iterable<[SchemaKey[], Assigner<JSONSchema7>]>;

  /**
   * Consistency checks to validate relationships between
   * pairs of schema keywords (e.g. `minimum` ≤ `maximum`).
   *
   * - A check ensures that two related keywords do not conflict.
   * - Providing this option **replaces the default checks** completely.
   *
   * @default DEFAULT_CHECKS
   */
  checks?: Iterable<CheckEntry<SchemaKey, SchemaKey>>;
}

export const DEFAULT_CHECKS = [
  check("minimum", "maximum", (t) => t.maximum >= t.minimum),
  check("exclusiveMinimum", "maximum", (t) => t.maximum > t.exclusiveMinimum),
  check("minimum", "exclusiveMaximum", (t) => t.exclusiveMaximum > t.minimum),
  check(
    "exclusiveMinimum",
    "exclusiveMaximum",
    (t) => t.exclusiveMaximum > t.exclusiveMinimum
  ),
  check("minLength", "maxLength", (t) => t.maxLength >= t.minLength),
  check("minItems", "maxItems", (t) => t.maxItems >= t.minItems),
  check(
    "minProperties",
    "maxProperties",
    (t) => t.maxProperties >= t.minProperties
  ),
];

export function createMerger({
  mergePatterns = simplePatternsMerger,
  isSubRegExp = Object.is,
  intersectJson = intersection,
  deduplicateJsonSchemaDef = identity,
  defaultMerger = identity,
  assigners = [],
  mergers,
  checks = DEFAULT_CHECKS,
}: MergeOptions = {}) {
  function mergeArrayOfSchemaDefinitions(
    schemas: JSONSchema7Definition[]
  ): JSONSchema7Definition {
    const l = schemas.length;
    let result = schemas[0]!;
    for (let i = 1; i < l; i++) {
      const r = mergeSchemaDefinitions(result, schemas[i]!);
      if (r === false) {
        return false;
      }
      if (isAllowAnySchema(r)) {
        continue;
      }
      result = r;
    }
    return result;
  }

  function createProperty(
    constraints: (JSONSchema7 | true)[],
    key: string,
    value: JSONSchema7Definition,
    patterns: CompiledPattern[],
    oppositeValue: JSONSchema7Definition | undefined,
    oppositePatterns: CompiledPattern[],
    oppositeAdditional: JSONSchema7 | false | undefined
  ): JSONSchema7Definition | undefined {
    constraints.length = 0;
    if (value === false) {
      return false;
    }
    constraints.push(value);
    const isOppositeValueDefined = oppositeValue !== undefined;
    if (isOppositeValueDefined) {
      if (oppositeValue === false) {
        return false;
      }
      constraints.push(oppositeValue);
    }
    if (appendKeyConstraints(constraints, key, oppositePatterns)) {
      return false;
    }
    const isNotYetAllowed = constraints.length < 2;
    if (oppositeAdditional === false) {
      // There are no allowing constraints from opposite side -> drop property
      if (isNotYetAllowed) {
        return undefined;
      }
      // Applying patterns of current schema cause they may disappear
      if (appendKeyConstraints(constraints, key, patterns)) {
        return false;
      }
    } else if (isNotYetAllowed && oppositeAdditional !== undefined) {
      constraints.push(oppositeAdditional);
    }
    const l = constraints.length;
    if (l === 1) {
      return constraints[0];
    }
    return mergeArrayOfSchemaDefinitions(constraints);
  }

  function assignPatternPropertiesAndAdditionalPropertiesMerge(
    target: Record<string, JSONSchema7Definition>,
    patterns: Record<string, JSONSchema7Definition> | undefined,
    patternKeys: string[],
    matchedPatterns: Set<string>,
    oppositeAdditional: JSONSchema7Definition,
    isOppositeTruthy: boolean
  ) {
    const l = patternKeys.length;
    if (l > 0 && oppositeAdditional !== false) {
      if (isOppositeTruthy) {
        // TODO: in some cases we can just assign new value instead of copying
        Object.assign(target, patterns);
      } else {
        for (let i = 0; i < l; i++) {
          const pattern = patternKeys[i]!;
          if (matchedPatterns.has(pattern)) {
            continue;
          }
          target[pattern] = mergeSchemaDefinitions(
            patterns![pattern]!,
            oppositeAdditional
          );
        }
      }
    }
    return target;
  }

  const propertiesAssigner: Assigner<JSONSchema7> = (
    target,
    {
      properties: lProps = {},
      patternProperties: lPatterns,
      additionalProperties: lAdditional = true,
    },
    {
      properties: rProps = {},
      patternProperties: rPatterns,
      additionalProperties: rAdditional = true,
    }
  ) => {
    // Special case
    const isLAddTruthy = isAllowAnySchema(lAdditional);
    const isRAddTruthy = isAllowAnySchema(rAdditional);
    if (isLAddTruthy && isRAddTruthy) {
      assignSchemaDefinitionOrRecordOfSchemaDefinitions(
        target,
        "properties",
        mergeRecordsOfSchemaDefinitions(lProps, rProps)
      );
      assignSchemaDefinitionOrRecordOfSchemaDefinitions(
        target,
        "patternProperties",
        lPatterns && rPatterns
          ? mergeRecordsOfSchemaDefinitions(lPatterns, rPatterns)
          : (lPatterns ?? rPatterns)
      );
      delete target.additionalProperties;
      return target;
    }
    // Additional Properties
    const additionalProperties = mergeSchemaDefinitions(
      lAdditional,
      rAdditional
    );
    assignSchemaDefinitionOrRecordOfSchemaDefinitions(
      target,
      "additionalProperties",
      additionalProperties
    );
    // Properties
    const properties: Record<string, JSONSchema7Definition> = {};
    const lKeys = Object.keys(lProps);
    const lKeysLen = lKeys.length;
    const [lCompiledPatterns, lPatternKeys] = lPatterns
      ? compilePatterns(lPatterns)
      : EMPTY_PATTERNS_AND_KEYS;
    const [rCompiledPatterns, rPatternKeys] = rPatterns
      ? compilePatterns(rPatterns)
      : EMPTY_PATTERNS_AND_KEYS;
    const constraints: (JSONSchema7 | true)[] = [];
    const lKeysSet = new Set<string>();
    const mappedRAdditional = isRAddTruthy ? undefined : rAdditional;
    for (let i = 0; i < lKeysLen; i++) {
      const key = lKeys[i]!;
      lKeysSet.add(key);
      const prop = createProperty(
        constraints,
        key,
        lProps[key]!,
        lCompiledPatterns,
        rProps[key],
        rCompiledPatterns,
        mappedRAdditional
      );
      if (prop !== undefined) {
        properties[key] = prop;
      }
    }
    const rKeys = Object.keys(rProps);
    const rKeysLen = rKeys.length;
    const mappedLAdditional = isLAddTruthy ? undefined : lAdditional;
    for (let i = 0; i < rKeysLen; i++) {
      const key = rKeys[i]!;
      if (lKeysSet.has(key)) {
        continue;
      }
      const prop = createProperty(
        constraints,
        key,
        rProps[key]!,
        rCompiledPatterns,
        undefined,
        lCompiledPatterns,
        mappedLAdditional
      );
      if (prop !== undefined) {
        properties[key] = prop;
      }
    }
    assignSchemaDefinitionOrRecordOfSchemaDefinitions(
      target,
      "properties",
      properties
    );
    // Pattern Properties
    // (lPatterns and rPatterns) or (lPatterns and rAdditional) or (rPatterns and lAdditional)
    let patterns: Record<string, JSONSchema7Definition> = {};
    const matchedPatterns = new Set<string>();
    if (lPatternKeys.length > 0 && rPatternKeys.length > 0) {
      const gen = createPairCombinations(
        lPatternKeys,
        rPatternKeys,
        (lKey, rKey) => {
          if (isSubRegExp(lKey, rKey)) {
            matchedPatterns.add(lKey);
          }
          if (isSubRegExp(rKey, lKey)) {
            matchedPatterns.add(rKey);
          }
          patterns[mergePatterns(lKey, rKey)] = mergeSchemaDefinitions(
            lPatterns![lKey]!,
            rPatterns![rKey]!
          );
        }
      );
      while (!gen.next().done) {
        /* empty */
      }
    }
    patterns = assignPatternPropertiesAndAdditionalPropertiesMerge(
      patterns,
      lPatterns,
      lPatternKeys,
      matchedPatterns,
      rAdditional,
      isRAddTruthy
    );
    patterns = assignPatternPropertiesAndAdditionalPropertiesMerge(
      patterns,
      rPatterns,
      rPatternKeys,
      matchedPatterns,
      lAdditional,
      isLAddTruthy
    );
    assignSchemaDefinitionOrRecordOfSchemaDefinitions(
      target,
      "patternProperties",
      patterns
    );
    return target;
  };

  const itemsAssigner: Assigner<JSONSchema7> = (
    target,
    // NOTE: Schema that has `additionalItems` without an `items` keyword is invalid
    // so the assigner should be triggered only be colliding `items` properties
    // so default values are used only for type narrowing
    { items: lItems = [], additionalItems: lAdditional },
    { items: rItems = [], additionalItems: rAdditional }
  ) => {
    const isLArr = Array.isArray(lItems);
    const isRArr = Array.isArray(rItems);
    const itemsArray: JSONSchema7Definition[] = [];
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
          additional === undefined || isAllowAnySchema(additional);
        for (; i < tail.length; i++) {
          itemsArray.push(
            isAdditionalTruthy
              ? tail[i]!
              : mergeSchemaDefinitions(tail[i]!, additional)
          );
        }
        assignSchemaDefinitionOrRecordOfSchemaDefinitions(
          target,
          "additionalItems",
          lAdditional !== undefined && rAdditional !== undefined
            ? mergeSchemaDefinitions(lAdditional, rAdditional)
            : (lAdditional ?? rAdditional)
        );
      }
    } else if (isLArr || isRArr) {
      const [arr, item, additional] = (
        isLArr ? [lItems, rItems, lAdditional] : [rItems, lItems, rAdditional]
      ) as [
        JSONSchema7Definition[],
        JSONSchema7Definition,
        JSONSchema7Definition | undefined,
      ];
      assignSchemaDefinitionOrRecordOfSchemaDefinitions(
        target,
        "additionalItems",
        additional && mergeSchemaDefinitions(additional, item)
      );
      for (let i = 0; i < arr.length; i++) {
        itemsArray.push(mergeSchemaDefinitions(arr[i]!, item));
      }
    } else {
      delete target.additionalItems;
      target.items = mergeSchemaDefinitions(lItems, rItems);
    }
    return target;
  };

  const conditionAssigner: Assigner<JSONSchema7> = (target, l, r) => {
    assignCondition(target, l);
    const cond = assignCondition({}, r);
    if (target.allOf === undefined) {
      target.allOf = [cond];
    } else {
      target.allOf = target.allOf.concat(cond);
    }
    return target;
  };

  function mergeArraysOfSchemaDefinition(
    l: JSONSchema7Definition[],
    r: JSONSchema7Definition[]
  ) {
    return deduplicateJsonSchemaDef(
      Array.from(createPairCombinations(l, r, mergeSchemaDefinitions))
    );
  }

  const ASSIGNERS_MAP = createAssignersMap([
    [PROPERTIES_ASSIGNER_KEYS, propertiesAssigner],
    [ITEMS_ASSIGNER_KEYS, itemsAssigner],
    [CONDITION_ASSIGNER_KEYS, conditionAssigner],
    ...assigners,
  ]);
  const CHECKS_MAP = createChecksMap(checks);

  function mergeSchemaDefinitions(
    left: JSONSchema7Definition,
    right: JSONSchema7Definition
  ) {
    if (left === false || right === false) {
      return false;
    }
    if (isAllowAnySchema(left)) {
      if (isAllowAnySchema(right)) {
        return true;
      }
      return right;
    }
    if (isAllowAnySchema(right)) {
      return left;
    }
    let target = { ...left };
    const assigners = new Set<Assigner<JSONSchema7>>();
    const checks = new Set<(target: JSONSchema7) => void>();
    const rKeys = Object.keys(right) as SchemaKey[];
    const l = rKeys.length;
    for (let i = 0; i < l; i++) {
      const rKey = rKeys[i]!;
      const rv = right[rKey];
      if (rv === undefined) {
        continue;
      }
      const checkData = CHECKS_MAP.get(rKey);
      if (checkData !== undefined) {
        const l = checkData.length;
        for (let j = 0; j < l; j++) {
          const item = checkData[j]!;
          if (left[item.oppositeKey] !== undefined) {
            checks.add(item.check);
          }
        }
      }
      const lv = left[rKey];
      if (lv === undefined) {
        // @ts-expect-error too complex
        target[rKey] = rv;
        continue;
      }
      const assign = ASSIGNERS_MAP.get(rKey);
      if (assign) {
        assigners.add(assign);
        continue;
      }
      const merge = MERGERS[rKey] ?? defaultMerger;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      target[rKey] = merge(lv as never, rv as never);
    }
    for (const assign of assigners) {
      target = assign(target, left, right);
    }
    for (const check of checks) {
      check(target);
    }
    return target;
  }

  const mergeRecordsOfSchemaDefinitions = createRecordsMerge(
    mergeSchemaDefinitions
  );

  const MERGERS: {
    [K in SchemaKey]?: Merger<Exclude<JSONSchema7[K], undefined>>;
  } = {
    $id: defaultMerger,
    $ref: defaultMerger,
    $schema: defaultMerger,
    $comment: defaultMerger,
    $defs: mergeRecordsOfSchemaDefinitions,
    definitions: mergeRecordsOfSchemaDefinitions,
    type: (a, b) => {
      if (a === b) {
        return a;
      }
      const isAArr = Array.isArray(a);
      const isBArr = Array.isArray(b);
      if (!isAArr && !isBArr) {
        const intersection = intersectSchemaTypes(a, b);
        if (intersection !== undefined) {
          return intersection;
        }
      } else if (isAArr || isBArr) {
        const r = new Set<JSONSchema7TypeName>();
        if (isAArr && isBArr) {
          for (const intersection of createPairCombinations(
            a,
            b,
            intersectSchemaTypes
          )) {
            if (intersection !== undefined) {
              r.add(intersection);
            }
          }
        } else {
          const arr = (isAArr ? a : b) as JSONSchema7TypeName[];
          const el = (isAArr ? b : a) as JSONSchema7TypeName;
          const l = arr.length;
          for (let i = 0; i < l; i++) {
            const intersection = intersectSchemaTypes(el, arr[i]!);
            if (intersection !== undefined) {
              r.add(intersection);
            }
          }
        }
        const s = r.size;
        if (s === 1) {
          return r.values().next().value!;
        }
        if (s > 1) {
          return Array.from(r);
        }
      }
      throw new Error(
        `It is not possible to create an intersection of the following incompatible types: ${a.toString()}, ${b.toString()}`
      );
    },
    default: defaultMerger,
    description: defaultMerger,
    title: defaultMerger,
    const: defaultMerger,
    format: defaultMerger,
    contentEncoding: defaultMerger,
    contentMediaType: defaultMerger,
    not: (a, b) => {
      const items = deduplicateJsonSchemaDef([a, b]);
      return items.length === 1 ? items[0]! : { anyOf: items };
    },
    pattern: mergePatterns,
    readOnly: mergeBooleans,
    writeOnly: mergeBooleans,
    enum: (a, b) => {
      const data = intersectJson(a, b);
      if (data.length === 0) {
        throw new Error(
          `Intersection of the following enums is empty: "${JSON.stringify(a)}", "${JSON.stringify(b)}"`
        );
      }
      return data;
    },
    anyOf: mergeArraysOfSchemaDefinition,
    oneOf: mergeArraysOfSchemaDefinition,
    allOf: (l, r) => deduplicateJsonSchemaDef(l.concat(r)),
    propertyNames: mergeSchemaDefinitions,
    contains: mergeSchemaDefinitions,
    dependencies: createRecordsMerge((a, b) => {
      if (Array.isArray(a)) {
        if (Array.isArray(b)) {
          return union(a, b);
        }
        return mergeSchemaDefinitions(b, { required: a });
      }
      if (Array.isArray(b)) {
        return mergeSchemaDefinitions(a, { required: b });
      }
      return mergeSchemaDefinitions(a, b);
    }),
    examples: (l, r) => {
      // https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-10.4
      if (!Array.isArray(l) || !Array.isArray(r)) {
        throw new Error(
          `Value of the 'examples' field should be an array, but got "${JSON.stringify(l)}" and "${JSON.stringify(r)}"`
        );
      }
      // TODO: Proper deduplication
      return union(l, r);
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
    uniqueItems: mergeBooleans,
    required: union,
    ...mergers,
  } satisfies {
    [K in Exclude<SchemaKey, AssignerKey>]-?: Merger<
      Exclude<JSONSchema7[K], undefined>
    >;
  };

  return {
    mergeSchemaDefinitions,
    mergeArrayOfSchemaDefinitions,
  };
}
