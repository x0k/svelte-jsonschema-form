import {
  DEPENDENCIES_KEY,
  IF_KEY,
  type SchemaDefinition,
} from "#core/index.js";
import { isSchemaObject } from "#lib/json-schema/index.js";

/**
 * The first value-path segment of every location that can make
 * `retrieveSchema` select a different `dependencies`/`if` branch, or
 * `undefined` when no bounded set of keys can be derived.
 *
 * Nested conditionals are attributed to the top-level property containing
 * them, so a change anywhere below that property counts as a trigger. This is
 * conservative but keeps the defaults pass off unrelated top-level fields.
 */
export type StaleDefaultsTriggerKeys = ReadonlySet<string> | undefined;

interface TriggerState {
  rootSchema: SchemaDefinition;
  keys: Set<string>;
  any: boolean;
  activeRefs: Set<string>;
}

/**
 * Collects the value keys whose changes may swap a declared default.
 *
 * Root-level `dependencies` contribute their dependency keys, and a root-level
 * `if` contributes the properties its condition reads. A conditional nested
 * below a property attributes to that property. When a condition cannot be
 * attributed safely (for example `if: { const: ... }` on a whole object), the
 * result is `undefined` and every change must be treated as a trigger.
 */
export function getStaleDefaultsTriggerKeys(
  schema: SchemaDefinition
): StaleDefaultsTriggerKeys {
  const state: TriggerState = {
    rootSchema: schema,
    keys: new Set(),
    any: false,
    activeRefs: new Set(),
  };
  walkSchema(state, schema, undefined, false);
  return state.any ? undefined : state.keys;
}

function addKey(state: TriggerState, key: string) {
  state.keys.add(key);
}

/**
 * Walks the schema locations that apply to a value path.
 *
 * `topKey` is the first value-path segment of the value this schema describes,
 * or `undefined` at the form root. `unknownPath` is set when the schema lives
 * below `additionalProperties`/`patternProperties` of the form root, where the
 * concrete key is not known statically.
 */
function walkSchema(
  state: TriggerState,
  schema: SchemaDefinition,
  topKey: string | undefined,
  unknownPath: boolean
): void {
  if (state.any || !isSchemaObject(schema)) {
    return;
  }

  const ref = schema.$ref;
  if (typeof ref === "string") {
    const target = resolveLocalRef(state.rootSchema, ref);
    if (target === undefined) {
      state.any = true;
      return;
    }
    if (!state.activeRefs.has(ref)) {
      state.activeRefs.add(ref);
      walkSchema(state, target, topKey, unknownPath);
      state.activeRefs.delete(ref);
    }
  }

  const dependencies = schema[DEPENDENCIES_KEY];
  if (
    typeof dependencies === "object" &&
    dependencies !== null &&
    !Array.isArray(dependencies)
  ) {
    if (topKey !== undefined) {
      addKey(state, topKey);
    } else if (unknownPath) {
      state.any = true;
    } else {
      for (const key of Object.keys(dependencies)) {
        addKey(state, key);
      }
    }
    // A dependency schema can itself declare an `if` or another `dependencies`
    // that reads different keys, e.g. `dependencies: { a: { if: <reads b> } }`.
    for (const key of Object.keys(dependencies)) {
      const dependency = dependencies[key];
      if (
        typeof dependency === "object" &&
        dependency !== null &&
        !Array.isArray(dependency)
      ) {
        walkSchema(state, dependency, topKey, unknownPath);
      }
    }
  }

  const ifSchema = schema[IF_KEY];
  if (ifSchema !== undefined) {
    if (topKey !== undefined) {
      addKey(state, topKey);
    } else if (unknownPath) {
      state.any = true;
    } else {
      const keys = getIfKeys(state, ifSchema, new Set());
      if (keys === undefined) {
        state.any = true;
      } else {
        for (const key of keys) {
          addKey(state, key);
        }
      }
    }
  }
  if (state.any) {
    return;
  }

  const properties = schema.properties;
  if (isSchemaRecord(properties)) {
    for (const key of Object.keys(properties)) {
      const property = properties[key];
      if (property !== undefined) {
        walkSchema(
          state,
          property,
          unknownPath ? topKey : (topKey ?? key),
          unknownPath
        );
      }
    }
  }

  const patternProperties = schema.patternProperties;
  if (isSchemaRecord(patternProperties)) {
    const nextUnknown = unknownPath || topKey === undefined;
    for (const key of Object.keys(patternProperties)) {
      const property = patternProperties[key];
      if (property !== undefined) {
        walkSchema(state, property, topKey, nextUnknown);
      }
    }
  }

  if (schema.additionalProperties !== undefined) {
    walkSchema(
      state,
      schema.additionalProperties,
      topKey,
      unknownPath || topKey === undefined
    );
  }

  walkSchemaList(state, schema.allOf, topKey, unknownPath);
  walkSchemaList(state, schema.anyOf, topKey, unknownPath);
  walkSchemaList(state, schema.oneOf, topKey, unknownPath);

  walkSchemaMaybe(state, schema.then, topKey, unknownPath);
  walkSchemaMaybe(state, schema.else, topKey, unknownPath);
  walkSchemaMaybe(state, schema.not, topKey, unknownPath);
  walkSchemaMaybe(state, schema.additionalItems, topKey, unknownPath);
  walkSchemaMaybe(state, schema.contains, topKey, unknownPath);

  const items = schema.items;
  if (Array.isArray(items)) {
    walkSchemaList(state, items, topKey, unknownPath);
  } else {
    walkSchemaMaybe(state, items, topKey, unknownPath);
  }
}

function walkSchemaMaybe(
  state: TriggerState,
  schema: SchemaDefinition | undefined,
  topKey: string | undefined,
  unknownPath: boolean
) {
  if (schema !== undefined) {
    walkSchema(state, schema, topKey, unknownPath);
  }
}

function walkSchemaList(
  state: TriggerState,
  schemas: readonly SchemaDefinition[] | undefined,
  topKey: string | undefined,
  unknownPath: boolean
) {
  if (schemas !== undefined) {
    for (const schema of schemas) {
      walkSchema(state, schema, topKey, unknownPath);
    }
  }
}

/**
 * Returns the top-level value keys an `if` condition can read, or `undefined`
 * when the condition may depend on something this function does not model.
 */
function getIfKeys(
  state: TriggerState,
  schema: SchemaDefinition,
  activeRefs: Set<string>
): Set<string> | undefined {
  if (typeof schema === "boolean") {
    // A constant condition can never swap on a value change.
    return new Set();
  }
  const keys = new Set<string>();

  const ref = schema.$ref;
  if (typeof ref === "string") {
    const target = resolveLocalRef(state.rootSchema, ref);
    if (target === undefined || activeRefs.has(ref)) {
      return undefined;
    }
    activeRefs.add(ref);
    const refKeys = getIfKeys(state, target, activeRefs);
    activeRefs.delete(ref);
    if (refKeys === undefined) {
      return undefined;
    }
    for (const key of refKeys) {
      keys.add(key);
    }
  }

  for (const [keyword, value] of Object.entries(schema)) {
    switch (keyword) {
      case "$ref":
        break;
      case "properties":
        if (!isSchemaRecord(value)) {
          return undefined;
        }
        for (const key of Object.keys(value)) {
          keys.add(key);
        }
        break;
      case "required":
        if (!Array.isArray(value)) {
          return undefined;
        }
        for (const key of value) {
          if (typeof key !== "string") {
            return undefined;
          }
          keys.add(key);
        }
        break;
      case "allOf":
      case "anyOf":
      case "oneOf":
        if (!Array.isArray(value)) {
          return undefined;
        }
        if (!mergeNestedIfKeys(keys, state, value, activeRefs)) {
          return undefined;
        }
        break;
      case "items":
        if (Array.isArray(value)) {
          if (!mergeNestedIfKeys(keys, state, value, activeRefs)) {
            return undefined;
          }
        } else if (
          !mergeNestedIfKey(keys, state, value as SchemaDefinition, activeRefs)
        ) {
          return undefined;
        }
        break;
      case "then":
      case "else":
      case "if":
      case "not":
      case "contains":
      case "additionalItems":
        if (
          !mergeNestedIfKey(keys, state, value as SchemaDefinition, activeRefs)
        ) {
          return undefined;
        }
        break;
      case "$id":
      case "$schema":
      case "$comment":
      case "$defs":
      case "definitions":
      case "title":
      case "description":
      case "default":
      case "examples":
      case "readOnly":
      case "writeOnly":
      case "deprecated":
      case "type":
      case "format":
        // Metadata and structural constraints that value edits do not change.
        break;
      default:
        // `const`, `enum`, `patternProperties`, `additionalProperties`,
        // numeric assertions, dependencies, and unknown keywords can depend on
        // the whole value or on keys that are not statically known.
        return undefined;
    }
  }

  return keys;
}

function mergeNestedIfKeys(
  keys: Set<string>,
  state: TriggerState,
  schemas: readonly SchemaDefinition[],
  activeRefs: Set<string>
): boolean {
  for (const schema of schemas) {
    if (!mergeNestedIfKey(keys, state, schema, activeRefs)) {
      return false;
    }
  }
  return true;
}

function mergeNestedIfKey(
  keys: Set<string>,
  state: TriggerState,
  schema: SchemaDefinition,
  activeRefs: Set<string>
): boolean {
  const nested = getIfKeys(state, schema, activeRefs);
  if (nested === undefined) {
    return false;
  }
  for (const key of nested) {
    keys.add(key);
  }
  return true;
}

function resolveLocalRef(
  rootSchema: SchemaDefinition,
  ref: string
): SchemaDefinition | undefined {
  if (!ref.startsWith("#")) {
    return undefined;
  }
  if (ref === "#") {
    return rootSchema;
  }
  if (!ref.startsWith("#/")) {
    return undefined;
  }
  let current: unknown = rootSchema;
  for (const rawPart of ref.slice(2).split("/")) {
    const part = decodeURIComponent(rawPart)
      .replace(/~1/g, "/")
      .replace(/~0/g, "~");
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "boolean") {
    return current;
  }
  if (
    typeof current === "object" &&
    current !== null &&
    !Array.isArray(current)
  ) {
    return current as SchemaDefinition;
  }
  return undefined;
}

function isSchemaRecord(
  value: unknown
): value is Record<string, SchemaDefinition | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
