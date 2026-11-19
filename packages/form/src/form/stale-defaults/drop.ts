/**
 * Removes values that still hold a swapped-away `dependencies` or
 * `if`/`then`/`else` branch's default, so the next defaults fill writes the
 * newly selected branch's declaration.
 *
 * The form records the values its writes replaced, so this pass can resolve
 * the schema against the data as it was before the change and leave a value the
 * user edited alone even when it equals the old default.
 */

import {
  ADDITIONAL_PROPERTY_FLAG,
  DEFAULT_KEY,
  getRootSchema,
  getSelectOptionValuesSafe,
  getXxxOfOptions,
  isSchemaDeepEqual,
  isSchemaObjectValue,
  isSelectSchema,
  isValueDeepEqual,
  PROPERTIES_KEY,
  REF_KEY,
  retrieveSchema,
  typeOfSchema,
  type CoreContext,
  type RPath,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
  type SchemaType,
} from "#core/index.js";
import { CORE_MERGER } from "#core/internals.js";
import { isSchemaObject } from "#lib/json-schema/index.js";
import { getOwn, setOwn } from "#lib/object.js";

import { declaresValueFor } from "../declares-value.js";
import type { FieldPath } from "../id.js";
import type { FormValueChange } from "../merger.js";
import type { FieldValue } from "../model.js";
import type { FormState } from "../state/index.js";
import { rebuildOldFormData } from "./path.js";

/**
 * A value the stale-defaults search removed, along with what the pass needs to
 * restore it or judge the replacement the defaults fill writes for it.
 */
export interface DroppedDefault {
  path: FieldPath;
  /**
   * The value that was at `path` before the drop.
   */
  value: FieldValue;
  /**
   * The schema that described `path` while it held `value`, which is what a
   * replacement the defaults fill writes is judged against.
   */
  writtenUnder: Schema | undefined;
}

export interface DropStaleDefaultsResult {
  formData: SchemaValue | undefined;
  /**
   * The values removed from `formData`, in walk order. A path's parent is never
   * listed alongside it, since a dropped key is not descended into.
   */
  dropped: readonly DroppedDefault[];
}

export interface DropStaleDefaultsOptions {
  /**
   * The schema resolved for the current form data.
   */
  newSchema: Schema;
  formData: SchemaValue | undefined;
  /**
   * Values written since the last defaults pass. A value at one of these paths,
   * or below one, belongs to the user, even when it equals the replaced
   * branch's default.
   */
  changes: readonly FormValueChange[];
  /**
   * The form data as it arrived, before this defaults pass dropped anything.
   * When omitted, it is rebuilt from `changes`.
   */
  oldFormData?: SchemaValue | undefined;
  /**
   * The schema resolved for `oldFormData`. When omitted, it is retrieved from
   * the context's root schema and `oldFormData`.
   */
  oldSchema?: Schema | undefined;
  /**
   * Paths this pass has already dropped. They are skipped so a replacement the
   * defaults fill has written is not dropped again.
   */
  droppedPaths?: ReadonlySet<FieldPath>;
  /**
   * Returns the canonical `FieldPath` for `key` below `parentPath`, so
   * `droppedPaths` can be compared by identity. The form supplies its own.
   */
  getChildPath: (parentPath: RPath, key: string | number) => FieldPath;
  /**
   * The flag the defaults fill is running with. The search computes the same
   * defaults as that fill, so it must use the same flag.
   * @default false
   */
  initialDefaultsGenerated?: boolean;
}

const NO_DROPPED_PATHS: ReadonlySet<FieldPath> = new Set();

function isContainerValue(value: SchemaValue | undefined): boolean {
  return Array.isArray(value) || isSchemaObjectValue(value);
}

/** Mirrors `isSanitizeOwned()` from RJSF: a scalar that no longer matches the
 * data the pass started from has already been moved by the fill or sanitize,
 * so dropping it again would record the old value and put it back if no fill
 * answers. Containers are still the search's to report: sanitize only edits
 * leaves inside them. */
function isSanitizeOwned(
  ctx: CoreContext,
  current: SchemaValue | undefined,
  oldCurrent: SchemaValue | undefined
): boolean {
  return (
    current !== undefined &&
    !isContainerValue(current) &&
    !isValueDeepEqual(ctx, current, oldCurrent)
  );
}

function isContainerType(type: SchemaType | SchemaType[]): boolean {
  return (
    type === "object" ||
    type === "array" ||
    (Array.isArray(type) && (type.includes("object") || type.includes("array")))
  );
}

/** Mirrors `isWholeValueSelect()` from RJSF: a select over object or array constants holds one of them whole, so it is
 * a value to replace rather than a level to walk. */
function isWholeValueSelect(ctx: CoreContext, schema: Schema): boolean {
  const schemaType = typeOfSchema(schema);
  const containerType = isContainerType(schemaType);
  // A declared primitive type rules the schema out before its options are scanned
  if (
    (!containerType && schema.type !== undefined) ||
    !isSelectSchema(ctx, schema)
  ) {
    return false;
  }
  if (containerType) {
    return true;
  }
  const values = getSelectOptionValuesSafe(schema) ?? [];
  return values.some(isContainerValue);
}

/** Mirrors `optionsDeclareProperties()` from RJSF: a level whose `oneOf`/`anyOf` options describe its properties is
 * `formDataForNewOption()`'s to switch, so this pass must leave the level's own defaults alone. It still descends into
 * the level, since a conditional declared on one of its properties is nothing to do with the options here. */
function optionsDeclareProperties(ctx: CoreContext, level: Schema): boolean {
  const options = getXxxOfOptions<SchemaDefinition>(level)?.options ?? [];
  return options.some((option) => {
    if (typeof option === "boolean") {
      return false;
    }
    if (isSchemaObjectValue(option[PROPERTIES_KEY])) {
      return true;
    }
    if (REF_KEY in option) {
      const resolved = retrieveSchema(ctx, option, undefined);
      return isSchemaObjectValue(resolved[PROPERTIES_KEY]);
    }
    return false;
  });
}

function levelDefault(level: Schema, key: string): SchemaValue | undefined {
  const declared = getOwn(level, DEFAULT_KEY);
  return isSchemaObjectValue(declared) ? getOwn(declared, key) : undefined;
}

/** Returns `schema` with its `properties` narrowed to `keys`, keeping every other keyword: `default` above all, since
 * it is what reaches each key as its parent defaults. Narrowing keeps the defaults computation proportional to the
 * keys that were swapped rather than to the size of the whole level. */
function onlyProperties(
  schema: Schema,
  properties: Record<string, SchemaDefinition>,
  keys: string[]
): Schema {
  const narrowed: Record<string, SchemaDefinition> = {};
  for (const key of keys) {
    setOwn(narrowed, key, properties[key]!);
  }
  return { ...schema, properties: narrowed };
}

/** Computes the defaults `schema` produces for `keys`, the same way the form's own fill does. */
function levelDefaults<T>(
  form: FormState<T>,
  schema: Schema,
  properties: Record<string, SchemaDefinition>,
  keys: string[],
  initialDefaultsGenerated: boolean
): SchemaObjectValue {
  const defaults = form[CORE_MERGER].mergeFormDataAndSchemaDefaults({
    schema: onlyProperties(schema, properties, keys),
    formData: undefined,
    initialDefaultsGenerated,
    includeUndefinedValues: false,
  });
  return isSchemaObjectValue(defaults) ? defaults : {};
}

function isPathPrefix(prefix: RPath, path: RPath) {
  return (
    prefix.length <= path.length &&
    prefix.every((part, index) => part === path[index])
  );
}

interface NestedKey {
  key: string;
  path: FieldPath;
  newSchema: Schema;
  oldSchema: Schema;
  current: SchemaObjectValue;
  oldCurrent: SchemaObjectValue;
  changedPaths: readonly RPath[];
}

function dropStaleDefaultsAtLevel<T>(
  ctx: FormState<T>,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaObjectValue,
  oldFormData: SchemaObjectValue,
  changedPaths: readonly RPath[],
  droppedPaths: ReadonlySet<FieldPath>,
  getChildPath: (parentPath: RPath, key: string | number) => FieldPath,
  levelPath: RPath,
  initialDefaultsGenerated: boolean,
  dropped: DroppedDefault[]
): SchemaObjectValue {
  const newProperties = newSchema.properties;
  const oldProperties = oldSchema.properties;
  if (newProperties === undefined || oldProperties === undefined) {
    return formData;
  }

  // Keys whose declarations differ and which are worth a defaults computation,
  // with the schema that describes each one as the data stands.
  const replaceable: { key: string; path: FieldPath; writtenUnder: Schema }[] =
    [];
  const nested: NestedKey[] = [];
  for (const key of Object.keys(newProperties)) {
    if (!Object.hasOwn(oldProperties, key)) {
      continue;
    }
    const currentPath = getChildPath(levelPath, key);
    if (droppedPaths.has(currentPath)) {
      continue;
    }
    const newRaw = newProperties[key];
    const oldRaw = oldProperties[key];
    if (!isSchemaObject(newRaw) || !isSchemaObject(oldRaw)) {
      continue;
    }
    const current = getOwn(formData, key);
    const oldCurrent = getOwn(oldFormData, key);
    if (current === undefined || oldCurrent === undefined) {
      continue;
    }

    const isChangedKey = changedPaths.some((path) =>
      isPathPrefix(path, currentPath)
    );
    const hasChangedBelow = changedPaths.some((path) =>
      isPathPrefix(currentPath, path)
    );
    // An `additionalProperties` stub is in `properties` only because the data
    // holds the key, and the fill does not write one after the initial defaults
    // have been generated, so dropping it would lose the value outright.
    const isStub = ADDITIONAL_PROPERTY_FLAG in newRaw;
    if (isStub && !hasChangedBelow) {
      continue;
    }
    const sameKeyedSchema = isSchemaDeepEqual(oldRaw, newRaw);
    // Without a change below this key, neither its own default nor anything
    // nested can differ when the keyed schema and the level's declaration for
    // it are unchanged.
    if (
      !hasChangedBelow &&
      sameKeyedSchema &&
      isValueDeepEqual(
        ctx,
        levelDefault(oldSchema, key),
        levelDefault(newSchema, key)
      )
    ) {
      continue;
    }

    const newResolved = retrieveSchema(ctx, newRaw, current);
    const oldResolved =
      sameKeyedSchema && oldCurrent === current
        ? newResolved
        : retrieveSchema(ctx, oldRaw, oldCurrent);

    // The changed field and everything below it belongs to the user. The
    // computed defaults are no guide on their own: both sides have to declare a
    // value for the key before a difference between what they compute means the
    // key is stale.
    if (
      !isChangedKey &&
      !hasChangedBelow &&
      !isStub &&
      !isSanitizeOwned(ctx, current, oldCurrent) &&
      declaresValueFor(newSchema, key, newResolved) &&
      declaresValueFor(oldSchema, key, oldResolved)
    ) {
      replaceable.push({ key, path: currentPath, writtenUnder: newResolved });
    }

    if (isSchemaObjectValue(current) && isSchemaObjectValue(oldCurrent)) {
      nested.push({
        key,
        path: currentPath,
        newSchema: newResolved,
        oldSchema: oldResolved,
        current,
        oldCurrent,
        changedPaths: changedPaths.filter(
          (path) =>
            isPathPrefix(path, currentPath) || isPathPrefix(currentPath, path)
        ),
      });
    }
  }

  let result = formData;
  const droppedKeys = new Set<string>();
  // A level whose options describe its properties is `formDataForNewOption()`'s
  // to switch, and the option `computeDefaults()` picks for a level with no
  // data of its own need not be the one the fill picks for the data there is.
  // Either side disqualifies the level; the walk still descends.
  if (
    replaceable.length > 0 &&
    !optionsDeclareProperties(ctx, newSchema) &&
    (newSchema === oldSchema || !optionsDeclareProperties(ctx, oldSchema))
  ) {
    const replaceableKeys = replaceable.map(({ key }) => key);
    const oldDefaults = levelDefaults(
      ctx,
      oldSchema,
      oldProperties,
      replaceableKeys,
      initialDefaultsGenerated
    );
    // The old side decides which keys still hold what the branch being swapped
    // away put there. Once the user has edited them that is none of them, and
    // the new side's defaults are then never computed at all.
    const holdingKeys = replaceableKeys.filter((key) =>
      isValueDeepEqual(ctx, getOwn(oldDefaults, key), getOwn(oldFormData, key))
    );
    if (holdingKeys.length > 0) {
      const newDefaults = levelDefaults(
        ctx,
        newSchema,
        newProperties,
        holdingKeys,
        initialDefaultsGenerated
      );
      const holding = new Set(holdingKeys);
      for (const { key, path, writtenUnder } of replaceable) {
        if (!holding.has(key)) {
          continue;
        }
        const oldDefault = getOwn(oldDefaults, key);
        const newDefault = getOwn(newDefaults, key);
        if (
          newDefault !== undefined &&
          !isValueDeepEqual(ctx, oldDefault, newDefault)
        ) {
          if (result === formData) {
            result = { ...formData };
          }
          delete result[key];
          droppedKeys.add(key);
          dropped.push({
            path,
            value: getOwn(oldFormData, key),
            writtenUnder,
          });
        }
      }
    }
  }

  for (const entry of nested) {
    if (droppedKeys.has(entry.key)) {
      continue;
    }
    // A select over object constants holds one of them whole, so it is a value
    // to replace rather than a level to walk.
    if (isWholeValueSelect(ctx, entry.newSchema)) {
      continue;
    }
    const next = dropStaleDefaultsAtLevel(
      ctx,
      entry.newSchema,
      entry.oldSchema,
      entry.current,
      entry.oldCurrent,
      entry.changedPaths,
      droppedPaths,
      getChildPath,
      entry.path,
      initialDefaultsGenerated,
      dropped
    );
    if (next !== entry.current) {
      if (result === formData) {
        result = { ...formData };
      }
      setOwn(result, entry.key, next);
    }
  }
  return result;
}

/**
 * Removes values that a swapped-in `dependencies` or `if`/`then`/`else`
 * substchema declared differently, so the next defaults fill writes the newly
 * selected branch's default.
 */
export function dropStaleDefaults<T>(
  form: FormState<T>,
  {
    newSchema,
    formData,
    changes,
    oldFormData: providedOldFormData,
    oldSchema: providedOldSchema,
    droppedPaths,
    getChildPath,
    initialDefaultsGenerated = false,
  }: DropStaleDefaultsOptions
): DropStaleDefaultsResult {
  if (!isSchemaObjectValue(formData) || !isSchemaObjectValue(newSchema)) {
    return { formData, dropped: [] };
  }
  const oldFormData =
    providedOldFormData ?? rebuildOldFormData(formData, changes);
  if (!isSchemaObjectValue(oldFormData)) {
    return { formData, dropped: [] };
  }
  const rootSchema = getRootSchema(form);
  const oldSchema =
    providedOldSchema ?? retrieveSchema(form, rootSchema, oldFormData);
  if (!isSchemaObjectValue(oldSchema)) {
    return { formData, dropped: [] };
  }
  const dropped: DroppedDefault[] = [];
  const nextFormData = dropStaleDefaultsAtLevel(
    form,
    newSchema,
    oldSchema,
    formData,
    oldFormData,
    changes.map(({ path }) => path),
    droppedPaths ?? NO_DROPPED_PATHS,
    getChildPath,
    [],
    initialDefaultsGenerated,
    dropped
  );
  return { formData: nextFormData, dropped };
}
