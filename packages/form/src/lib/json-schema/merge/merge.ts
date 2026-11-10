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
} from "#lib/array.js";
import { identity } from "#lib/function.js";
import {
  isAllowAnySchema,
  isSchemaWithItems,
  type SchemaWithItems,
} from "#lib/json-schema/index.js";
import { lcm } from "#lib/math.js";
import { getOwn, setOwn } from "#lib/object.js";
import { escapeRegex } from "#lib/reg-exp.js";

import { simplePatternsMerger } from "./patterns.js";

type SchemaKey = keyof JSONSchema7;

function createPairCombinations<T, R>(
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
        action(lv, r[j]!);
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
      const lv = getOwn(left, key);
      setOwn(
        target,
        key,
        lv === undefined ? right[key]! : merge(lv, right[key]!)
      );
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

function createMap<R>(items: Iterable<[SchemaKey[], R]>) {
  const map = new Map<SchemaKey, R>();
  for (const pair of items) {
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
  patterns: CompiledPattern[],
  matches?: string[][]
): boolean {
  let hasFalseSchema = false;
  const l = patterns.length;
  for (let i = 0; i < l; i++) {
    const p = patterns[i]!;
    if (!p.regExp.test(key)) {
      continue;
    }
    if (matches !== undefined) {
      // Reuse this test for pattern subtraction: the name is known to match
      // pattern `i`, so the subtractor will not have to scan it again. Keep
      // collecting after a `false` schema because the name still has to be
      // excluded from the opposite `additionalProperties`.
      matches[i]!.push(key);
    }
    const s = p.schema;
    if (s === false) {
      if (matches === undefined) {
        return true;
      }
      // The property is already rejected, so additional constraints would be
      // discarded by the caller. Keep scanning only to record all matches.
      hasFalseSchema = true;
      continue;
    }
    if (!hasFalseSchema) {
      target.push(s);
    }
  }
  return hasFalseSchema;
}

/**
 * Records which patterns match `key` without building constraints.
 *
 * Used for properties that short-circuit before `appendKeyConstraints`, so the
 * pattern match cache stays complete.
 */
function recordPatternMatches(
  key: string,
  patterns: CompiledPattern[],
  matches: string[][]
) {
  const l = patterns.length;
  for (let i = 0; i < l; i++) {
    if (patterns[i]!.regExp.test(key)) {
      matches[i]!.push(key);
    }
  }
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

const CONTAINS_ASSIGNER_KEYS = ["contains"] as const satisfies SchemaKey[];

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

function assignItems(
  target: JSONSchema7,
  { items, additionalItems }: SchemaWithItems
) {
  target.items = items;
  assignSchemaDefinitionOrRecordOfSchemaDefinitions(
    target,
    "additionalItems",
    Array.isArray(items) ? additionalItems : undefined
  );
  return target;
}

type AssignerKey =
  | (typeof PROPERTIES_ASSIGNER_KEYS)[number]
  | (typeof ITEMS_ASSIGNER_KEYS)[number]
  | (typeof CONDITION_ASSIGNER_KEYS)[number]
  | (typeof CONTAINS_ASSIGNER_KEYS)[number];

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
 * Creates a pattern subtractor that removes property names and names matching
 * the given patterns from the language of a pattern.
 *
 * The subtractor is an implementation detail of `propertiesAssigner` and is
 * intentionally not exported.
 *
 * `matchingPropertyNames` must already be filtered to names that match
 * `pattern`. The property loops record matches while testing them against the
 * opposite patterns, so testing them again here would duplicate that work.
 */
function createPatternSubtractor(mergePatterns: Merger<string>) {
  return (
    pattern: string,
    matchingPropertyNames: string[],
    patterns: string[]
  ) => {
    const propertyNamesLen = matchingPropertyNames.length;
    const patternsLen = patterns.length;
    let names: string | undefined;
    for (let i = 0; i < propertyNamesLen; i++) {
      const escapedName = escapeRegex(matchingPropertyNames[i]!);
      names = names === undefined ? escapedName : `${names}|${escapedName}`;
    }
    if (names === undefined && patternsLen === 0) {
      return pattern;
    }
    const excluded: string[] = [];
    if (names !== undefined) {
      // `$` also matches before a trailing newline, so assert the true end of
      // the property name instead.
      excluded.push(`(?:${names})(?![\\s\\S])`);
    }
    if (patternsLen > 0) {
      let alternatives = patterns[0]!;
      for (let i = 1; i < patternsLen; i++) {
        alternatives += `|${patterns[i]!}`;
      }
      // Reproduce `RegExp.prototype.test` search semantics inside the anchored
      // lookahead. `[\s\S]` (unlike `.`) can also skip line terminators.
      excluded.push(`[\\s\\S]*(?:${alternatives})`);
    }
    // `^(?!...)` matches names that are not excluded, so combining it with the
    // original pattern yields the required subset.
    return mergePatterns(pattern, `^(?!(?:${excluded.join("|")}))`);
  };
}

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
  checks = DEFAULT_CHECKS,
  mergers,
}: MergeOptions = {}) {
  const subtractPattern = createPatternSubtractor(mergePatterns);
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
    oppositeAdditional: JSONSchema7 | false | undefined,
    oppositePatternMatches?: string[][]
  ): JSONSchema7Definition | undefined {
    constraints.length = 0;
    if (value === false) {
      // A `false` property is still a declared name, so it has to stay in the
      // pattern match cache used by `subtractPattern`. The merged property is
      // `false` either way, which rejects the name.
      if (oppositePatternMatches !== undefined) {
        recordPatternMatches(key, oppositePatterns, oppositePatternMatches);
      }
      return false;
    }
    constraints.push(value);
    const isOppositeValueDefined = oppositeValue !== undefined;
    if (isOppositeValueDefined) {
      if (oppositeValue === false) {
        // See the `value === false` branch above.
        if (oppositePatternMatches !== undefined) {
          recordPatternMatches(key, oppositePatterns, oppositePatternMatches);
        }
        return false;
      }
      constraints.push(oppositeValue);
    }
    if (
      appendKeyConstraints(
        constraints,
        key,
        oppositePatterns,
        oppositePatternMatches
      )
    ) {
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
    isOppositeTruthy: boolean,
    oppositePropertyNames: string[],
    oppositePatterns: string[],
    oppositePatternMatches: string[][] | undefined
  ) {
    const l = patternKeys.length;
    if (l > 0 && oppositeAdditional !== false) {
      if (isOppositeTruthy) {
        // Pair combinations already contain the merged schemas for
        // overlapping patterns, so don't overwrite them.
        for (let i = 0; i < l; i++) {
          const pattern = patternKeys[i]!;
          if (!Object.hasOwn(target, pattern)) {
            setOwn(target, pattern, patterns![pattern]!);
          }
        }
      } else {
        for (let i = 0; i < l; i++) {
          const pattern = patternKeys[i]!;
          if (matchedPatterns.has(pattern)) {
            continue;
          }
          const schema = getOwn(target, pattern) ?? patterns![pattern]!;
          const hasExcludedNames = oppositePropertyNames.length > 0;
          const hasExcludedPatterns = oppositePatterns.length > 0;
          const enrichedPattern =
            hasExcludedNames || hasExcludedPatterns
              ? subtractPattern(
                  pattern,
                  // These are exactly the opposite property names that match
                  // this pattern. They were recorded while merging properties.
                  // The cache is guaranteed to exist here because the subtract
                  // branch only runs when the opposite `additionalProperties`
                  // is a constrained schema.
                  oppositePatternMatches![i]!,
                  oppositePatterns
                )
              : pattern;
          if (enrichedPattern === pattern) {
            setOwn(
              target,
              pattern,
              mergeSchemaDefinitions(schema, oppositeAdditional)
            );
          } else {
            // The opposite `additionalProperties` does not apply to
            // properties explicitly declared on the opposite side or
            // to names covered by its `patternProperties`.
            setOwn(target, pattern, schema);
            setOwn(
              target,
              enrichedPattern,
              mergeSchemaDefinitions(schema, oppositeAdditional)
            );
          }
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
    const mappedLAdditional = isLAddTruthy ? undefined : lAdditional;
    // The property loops below already test names against the opposite side's
    // patterns. Record which names matched so subtraction can reuse the result
    // instead of scanning every opposite property name again.
    //
    // `rPatternMatches` belongs to the right side's patterns: the left `keys`
    // loop tests left property names against them. `lPatternMatches` is the
    // mirror image.
    const rPatternMatches =
      mappedLAdditional !== undefined &&
      mappedLAdditional !== false &&
      rPatternKeys.length > 0
        ? rPatternKeys.map(() => [] as string[])
        : undefined;
    const lPatternMatches =
      mappedRAdditional !== undefined &&
      mappedRAdditional !== false &&
      lPatternKeys.length > 0
        ? lPatternKeys.map(() => [] as string[])
        : undefined;
    for (let i = 0; i < lKeysLen; i++) {
      const key = lKeys[i]!;
      lKeysSet.add(key);
      const prop = createProperty(
        constraints,
        key,
        lProps[key]!,
        lCompiledPatterns,
        getOwn(rProps, key),
        rCompiledPatterns,
        mappedRAdditional,
        rPatternMatches
      );
      if (prop !== undefined) {
        setOwn(properties, key, prop);
      }
    }
    const rKeys = Object.keys(rProps);
    const rKeysLen = rKeys.length;
    for (let i = 0; i < rKeysLen; i++) {
      const key = rKeys[i]!;
      if (lKeysSet.has(key)) {
        // The name is declared on both sides. The left loop could only record
        // its matches against the right patterns, so record its matches
        // against the left patterns here. Otherwise the left patterns would
        // miss this name when their subtraction runs.
        if (lPatternMatches !== undefined) {
          recordPatternMatches(key, lCompiledPatterns, lPatternMatches);
        }
        continue;
      }
      const prop = createProperty(
        constraints,
        key,
        rProps[key]!,
        rCompiledPatterns,
        undefined,
        lCompiledPatterns,
        mappedLAdditional,
        lPatternMatches
      );
      if (prop !== undefined) {
        setOwn(properties, key, prop);
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
    // An `additionalProperties: false` side keeps only the intersection of the
    // two pattern languages, so every pair has to be materialized. Otherwise
    // both plain patterns are retained and JSON Schema applies their schemas
    // together, making pair combinations of unrelated patterns redundant.
    // Pairs where one pattern is a subset of the other still need a merged
    // entry because the subset pattern's plain entry is skipped.
    const needAllPairCombinations =
      lAdditional === false || rAdditional === false;
    if (lPatternKeys.length > 0 && rPatternKeys.length > 0) {
      createPairCombinations(lPatternKeys, rPatternKeys, (lKey, rKey) => {
        const isLKeySubset = isSubRegExp(lKey, rKey);
        if (isLKeySubset) {
          matchedPatterns.add(lKey);
        }
        const isRKeySubset = isSubRegExp(rKey, lKey);
        if (isRKeySubset) {
          matchedPatterns.add(rKey);
        }
        if (needAllPairCombinations || isLKeySubset || isRKeySubset) {
          setOwn(
            patterns,
            mergePatterns(lKey, rKey),
            mergeSchemaDefinitions(lPatterns![lKey]!, rPatterns![rKey]!)
          );
        }
      });
    }
    patterns = assignPatternPropertiesAndAdditionalPropertiesMerge(
      patterns,
      lPatterns,
      lPatternKeys,
      matchedPatterns,
      rAdditional,
      isRAddTruthy,
      rKeys,
      rPatternKeys,
      lPatternMatches
    );
    patterns = assignPatternPropertiesAndAdditionalPropertiesMerge(
      patterns,
      rPatterns,
      rPatternKeys,
      matchedPatterns,
      lAdditional,
      isLAddTruthy,
      lKeys,
      lPatternKeys,
      rPatternMatches
    );
    assignSchemaDefinitionOrRecordOfSchemaDefinitions(
      target,
      "patternProperties",
      patterns
    );
    return target;
  };

  const itemsAssigner: Assigner<JSONSchema7> = (target, l, r) => {
    // `additionalItems` only applies next to an array of `items`, so a side
    // without `items` constrains nothing here and the other side is kept as is
    if (!isSchemaWithItems(l)) {
      if (!isSchemaWithItems(r)) {
        delete target.items;
        delete target.additionalItems;
        return target;
      }
      return assignItems(target, r);
    }
    if (!isSchemaWithItems(r)) {
      return assignItems(target, l);
    }
    const { items: lItems, additionalItems: lAdditional } = l;
    const { items: rItems, additionalItems: rAdditional } = r;
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
        // A schema-valued `items` applies to every element, including those
        // after the tuple, so it constrains `additionalItems` even when the
        // tuple side does not define one.
        additional === undefined
          ? item
          : mergeSchemaDefinitions(additional, item)
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

  const containsAssigner: Assigner<JSONSchema7> = (target, l, r) => {
    const lContains = l.contains!;
    const rContains = r.contains!;
    // Cheapest hot path: identical reference (target already holds it via spread).
    if (lContains === rContains) return target;
    // `contains: false` rejects every array, so it dominates the conjunction
    // (non-array instances ignore `contains` on both sides).
    if (lContains === false || rContains === false) {
      target.contains = false;
      return target;
    }
    // `contains: true` (or `{}`) only requires a non-empty array, which is
    // already implied by any other `contains`, so the other side wins.
    // (If both sides allow any, either one is equivalent.)
    if (isAllowAnySchema(lContains)) {
      target.contains = rContains;
      return target;
    }
    if (isAllowAnySchema(rContains)) {
      target.contains = lContains;
      return target;
    }
    // Idempotence: `contains: C` ∧ `contains: C` ≡ `contains: C`
    // (target already holds `lContains` via spread).
    if (deduplicateJsonSchemaDef([lContains, rContains]).length === 1) {
      return target;
    }
    // Existential conjunction cannot be expressed as a single `contains`
    // (`∃i C1(i) ∧ ∃j C2(j)` allows `i ≠ j`, while `∃k C1(k) ∧ C2(k)`
    // requires a single witness), so preserve both branches exactly.
    // Like `conditionAssigner`, keep left at root and move only right to `allOf`.
    const branch: JSONSchema7Definition = { contains: rContains };
    target.allOf =
      target.allOf === undefined
        ? [branch]
        : deduplicateJsonSchemaDef(target.allOf.concat(branch));
    return target;
  };

  function mergeArraysOfSchemaDefinition(
    l: JSONSchema7Definition[],
    r: JSONSchema7Definition[]
  ) {
    const definitions: JSONSchema7Definition[] = [];
    createPairCombinations(l, r, (a, b) => {
      try {
        definitions.push(mergeSchemaDefinitions(a, b));
      } catch {
        /* empty */
      }
    });
    if (definitions.length === 0) {
      throw new Error(
        `No valid schema combinations could be produced for "${JSON.stringify(l)}" and "${JSON.stringify(r)}"; the merged result is empty`
      );
    }
    return deduplicateJsonSchemaDef(definitions);
  }

  const ASSIGNERS_MAP = createMap([
    [PROPERTIES_ASSIGNER_KEYS, propertiesAssigner],
    [ITEMS_ASSIGNER_KEYS, itemsAssigner],
    [CONDITION_ASSIGNER_KEYS, conditionAssigner],
    [CONTAINS_ASSIGNER_KEYS, containsAssigner],
    ...assigners,
  ]);

  const ASSIGNEER_KEYS = new Map<Assigner<JSONSchema7>, SchemaKey[]>();
  for (const [key, assigner] of ASSIGNERS_MAP) {
    const owned = ASSIGNEER_KEYS.get(assigner);
    if (owned === undefined) {
      ASSIGNEER_KEYS.set(assigner, [key]);
    } else {
      owned.push(key);
    }
  }

  function hasAssignerKey(left: JSONSchema7, assigner: Assigner<JSONSchema7>) {
    const keys = ASSIGNEER_KEYS.get(assigner)!;
    for (let i = 0; i < keys.length; i++) {
      if (left[keys[i]!] !== undefined) {
        return true;
      }
    }
    return false;
  }

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
    const rKeys = Reflect.ownKeys(right) as SchemaKey[];
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
      const assign = ASSIGNERS_MAP.get(rKey);
      if (assign !== undefined && hasAssignerKey(left, assign)) {
        assigners.add(assign);
        continue;
      }
      const lv = getOwn(left, rKey);
      if (lv === undefined) {
        setOwn(target, rKey, rv as never);
        continue;
      }
      // `MERGERS` has a null prototype, so inherited keys cannot leak in.
      const merge = MERGERS[rKey] ?? defaultMerger;
      setOwn(target, rKey, merge(lv as never, rv as never) as never);
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

  // A null prototype makes plain keyed reads safe: schema keys such as
  // `constructor` must not resolve to inherited members.
  const MERGERS: {
    [K in SchemaKey]?: Merger<Exclude<JSONSchema7[K], undefined>>;
  } = Object.assign(Object.create(null), {
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
          createPairCombinations(a, b, (x, y) => {
            const type = intersectSchemaTypes(x, y);
            if (type !== undefined) {
              r.add(type);
            }
          });
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
          `Intersection of the following enums is empty: "${JSON.stringify(
            a
          )}", "${JSON.stringify(b)}"`
        );
      }
      return data;
    },
    anyOf: mergeArraysOfSchemaDefinition,
    oneOf: mergeArraysOfSchemaDefinition,
    allOf: (l, r) => deduplicateJsonSchemaDef(l.concat(r)),
    propertyNames: mergeSchemaDefinitions,
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
          `Value of the 'examples' field should be an array, but got "${JSON.stringify(
            l
          )}" and "${JSON.stringify(r)}"`
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
  });

  return {
    mergeSchemaDefinitions,
    mergeArrayOfSchemaDefinitions,
  };
}
