import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";

import { getValueByKeys, insertValue, type Trie } from "@/lib/trie.js";
import { intersection, union } from "@/lib/array.js";
import { createPairMatcher } from "@/lib/function.js";
import { isAllowAnySchema } from "@/lib/json-schema.js";
import { isRecordEmpty } from "@/lib/object.js";
import { lcm } from "@/lib/math.js";

import { simplePatternsMerger } from "./merge-patterns.js";

type SchemaKey = keyof JSONSchema7;

function last<T>(_: T, r: T) {
  return r;
}

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

type Assigner<R extends {}> = (target: R, l: R, r: R) => void;

function createAssignersTrie(
  assigners: Iterable<[SchemaKey[], Assigner<JSONSchema7>]>
) {
  let trie: Trie<string, Assigner<JSONSchema7>> = undefined;
  for (const pair of assigners) {
    for (const key of pair[0]) {
      trie = insertValue(trie, key, pair[1]);
    }
  }
  return trie;
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
    case "integer": {
      if (b === "number") {
        return "integer";
      }
    }
    default:
      return undefined;
  }
}

export type Merger<T> = (a: T, b: T) => T;

export interface MergeOptions {
  isSubRegExp?: (subExpr: string, superExpr: string) => boolean;
  mergePatterns?: (a: string, b: string) => string;
}

const isAllowAnySchemaShort = (def: true | JSONSchema7) =>
  def === true || isRecordEmpty(def);

export function createMerger({
  mergePatterns = simplePatternsMerger,
  isSubRegExp = Object.is,
}: MergeOptions = {}) {
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
    let i = 0;
    while (i < l && isAllowAnySchemaShort(constraints[i]!)) {
      i++;
    }
    if (i === l) {
      return true;
    }
    let result = constraints[i++]! as JSONSchema7;
    for (; i < l; i++) {
      const c = constraints[i]!;
      if (isAllowAnySchemaShort(c)) {
        continue;
      }
      result = mergeSchemas(result, c);
    }
    return result;
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
        // TODO: in some cases we can just assign new value instead of cloning
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
      return;
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
    // patternProperties
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
      while (!gen.next().done) {}
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
    let itemsArray: JSONSchema7Definition[] = [];
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
        additional
      );
      for (let i = 0; i < arr.length; i++) {
        itemsArray.push(mergeSchemaDefinitions(arr[i]!, item));
      }
    } else {
      delete target.additionalItems;
      target.items = mergeSchemaDefinitions(lItems, rItems);
    }
  };

  const conditionAssigner: Assigner<JSONSchema7> = (target, l, r) => {
    assignCondition(target, l);
    const cond = assignCondition({}, r);
    if (target.allOf === undefined) {
      target.allOf = [cond];
    } else {
      target.allOf = target.allOf.concat(cond);
    }
  };

  function mergeArraysOfSchemaDefinition(
    l: JSONSchema7Definition[],
    r: JSONSchema7Definition[]
  ) {
    return Array.from(createPairCombinations(l, r, mergeSchemaDefinitions));
  }

  const ASSIGNERS_TRIE = createAssignersTrie([
    [PROPERTIES_ASSIGNER_KEYS, propertiesAssigner],
    [ITEMS_ASSIGNER_KEYS, itemsAssigner],
    [CONDITION_ASSIGNER_KEYS, conditionAssigner],
  ]);

  function mergeSchemas(left: JSONSchema7, right: JSONSchema7): JSONSchema7 {
    const target = { ...left };
    const assigners = new Set<Assigner<JSONSchema7>>();
    const rKeys = Object.keys(right) as SchemaKey[];
    const l = rKeys.length;
    for (let i = 0; i < l; i++) {
      const rKey = rKeys[i]!;
      const rv = right[rKey];
      if (rv === undefined) {
        continue;
      }
      const lv = left[rKey];
      if (lv === undefined) {
        // @ts-expect-error
        target[rKey] = rv;
        continue;
      }
      const assign = getValueByKeys(ASSIGNERS_TRIE, rKey);
      if (assign) {
        assigners.add(assign);
        continue;
      }
      const merge = MERGERS[rKey as keyof typeof MERGERS] ?? last;
      // @ts-expect-error
      target[rKey] = merge(lv, rv);
    }
    for (const assign of assigners) {
      assign(target, left, right);
    }
    return target;
  }

  const mergeSchemaOrTrue = createPairMatcher<
    true | JSONSchema7,
    true | Record<string, never>,
    true | JSONSchema7
  >(
    isAllowAnySchema,
    () => true,
    (_, r) => r,
    (l) => l,
    mergeSchemas
  );

  function mergeSchemaDefinitions(
    l: JSONSchema7Definition,
    r: JSONSchema7Definition
  ) {
    if (l === false || r === false) {
      return false;
    }
    return mergeSchemaOrTrue(l, r);
  }

  const mergeRecordsOfSchemaDefinitions = createRecordsMerge(
    mergeSchemaDefinitions
  );

  const mergeSchemaDefinitionsOrArrayOfString = createPairMatcher<
    JSONSchema7Definition | string[],
    string[],
    JSONSchema7Definition | string[]
  >(
    Array.isArray,
    union,
    (l, r) => mergeSchemaDefinitions({ required: l }, r),
    (l, r) => mergeSchemaDefinitions(l, { required: r }),
    mergeSchemaDefinitions
  );

  const MERGERS: {
    [K in Exclude<SchemaKey, AssignerKey>]-?: Merger<
      Exclude<JSONSchema7[K], undefined>
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
        `It is not possible to create an intersection of the following types: ${a}, ${b}`
      );
    },
    default: last,
    description: last,
    title: last,
    const: last,
    format: last,
    contentEncoding: last,
    contentMediaType: last,
    // TODO: Perform equality check to simplify result
    not: (a, b) => ({ anyOf: [a, b] }),
    pattern: mergePatterns,
    readOnly: mergeBooleans,
    writeOnly: mergeBooleans,
    // TODO: Proper deduplication
    // TODO: Proper intersection
    enum: intersection,
    // TODO: Proper deduplication
    anyOf: mergeArraysOfSchemaDefinition,
    // TODO: Proper deduplication
    oneOf: mergeArraysOfSchemaDefinition,
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
  };

  return {
    mergeSchemas,
    mergeSchemaDefinitions,
  };
}
