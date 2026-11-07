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
  getSelectOptionValuesSafe,
  getXxxOfOptions,
  isSchemaDeepEqual,
  isSchemaObjectValue,
  isSelect,
  PROPERTIES_KEY,
  REF_KEY,
  retrieveSchema,
  typeOfSchema,
  type RPath,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
  type SchemaType,
  type Validator,
} from "#core/index.js";
import { getOwn, isRecord, setOwn } from "#lib/object.js";

import { pathKey } from "./change-path.js";
import { declaresValueFor } from "./declares-value.js";
import type {
  DroppedDefault,
  DropStaleDefaultsOptions,
  DropStaleDefaultsResult,
  FormMerger,
  FormValueChange,
} from "./merger.js";
import type { FieldValue, FormValue } from "./model.js";

const NO_DROPPED_PATHS: ReadonlySet<string> = new Set();

function isSchemaObject(value: unknown): value is Schema {
  return isRecord(value);
}

function isContainerValue(value: SchemaValue | undefined): boolean {
  return Array.isArray(value) || isSchemaObjectValue(value);
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
function isWholeValueSelect(
  validator: Validator,
  merger: FormMerger,
  schema: Schema,
  rootSchema: Schema
): boolean {
  const schemaType = typeOfSchema(schema);
  const containerType = isContainerType(schemaType);
  // A declared primitive type rules the schema out before its options are scanned
  if (
    (!containerType && schema.type !== undefined) ||
    !isSelect(validator, merger, schema, rootSchema)
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
function optionsDeclareProperties(
  validator: Validator,
  merger: FormMerger,
  level: Schema,
  rootSchema: Schema
): boolean {
  const options = getXxxOfOptions<SchemaDefinition>(level)?.options ?? [];
  return options.some((option) => {
    if (typeof option === "boolean") {
      return false;
    }
    if (isSchemaObjectValue(option[PROPERTIES_KEY])) {
      return true;
    }
    if (REF_KEY in option) {
      const resolved = retrieveSchema(validator, merger, option, rootSchema);
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
  properties: Record<string, unknown>,
  keys: string[]
): Schema {
  const narrowed: Record<string, unknown> = {};
  for (const key of keys) {
    setOwn(narrowed, key, properties[key]);
  }
  return { ...schema, properties: narrowed as Schema["properties"] };
}

/** Computes the defaults `schema` produces for `keys`, the same way the form's own fill does. */
function levelDefaults(
  merger: FormMerger,
  schema: Schema,
  properties: Record<string, unknown>,
  keys: string[],
  initialDefaultsGenerated: boolean
): SchemaObjectValue {
  const defaults = merger.mergeFormDataAndSchemaDefaults({
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

function copyContainer(
  value: unknown,
  nextKey: RPath[number]
): Record<PropertyKey, unknown> {
  if (Array.isArray(value)) {
    return value.slice() as unknown as Record<PropertyKey, unknown>;
  }
  if (isRecord(value)) {
    return { ...value };
  }
  if (value === undefined || value === null) {
    return (typeof nextKey === "number" ? [] : {}) as Record<
      PropertyKey,
      unknown
    >;
  }
  throw new Error("Cannot rebuild data through a primitive value");
}

/** Puts `value` back at `path`, copying only the containers along the path. */
export function replaceAtPath(
  root: FormValue,
  path: RPath,
  value: FieldValue,
  level = 0
): FormValue {
  if (level === path.length) {
    return value;
  }
  const key = path[level]!;
  const source = root as Record<PropertyKey, unknown> | undefined;
  const copy = copyContainer(source, key);
  const child =
    source === undefined || source === null ? undefined : getOwn(source, key);
  setOwn(copy, key, replaceAtPath(child as FormValue, path, value, level + 1));
  return copy as FormValue;
}

/**
 * Rebuilds the data a defaults pass started from by putting back every value
 * `changes` replaced. Used once per pass, because later iterations have already
 * dropped values the search still has to see on the old side.
 */
export function rebuildOldFormData(
  formData: SchemaValue | undefined,
  changes: readonly FormValueChange[]
): FormValue {
  let oldFormData = formData as FormValue;
  for (let i = changes.length - 1; i >= 0; i--) {
    const change = changes[i]!;
    oldFormData = replaceAtPath(oldFormData, change.path, change.oldValue);
  }
  return oldFormData;
}

interface NestedKey {
  key: string;
  newSchema: Schema;
  oldSchema: Schema;
  current: SchemaObjectValue;
  oldCurrent: SchemaObjectValue;
  changedPaths: readonly RPath[];
}

function dropStaleDefaultsAtLevel(
  validator: Validator,
  merger: FormMerger,
  rootSchema: Schema,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaObjectValue,
  oldFormData: SchemaObjectValue,
  changedPaths: readonly RPath[],
  droppedPaths: ReadonlySet<string>,
  levelPath: RPath,
  initialDefaultsGenerated: boolean,
  dropped: DroppedDefault[]
): SchemaObjectValue {
  const newProperties = newSchema.properties;
  const oldProperties = oldSchema.properties;
  if (
    !isSchemaObjectValue(newProperties) ||
    !isSchemaObjectValue(oldProperties)
  ) {
    return formData;
  }

  // Keys whose declarations differ and which are worth a defaults computation,
  // with the schema that describes each one as the data stands.
  const replaceable: { key: string; writtenUnder: Schema }[] = [];
  const nested: NestedKey[] = [];
  for (const key of Object.keys(newProperties)) {
    if (!Object.hasOwn(oldProperties, key)) {
      continue;
    }
    const currentPath = [...levelPath, key];
    if (droppedPaths.has(pathKey(currentPath))) {
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
    const sameKeyedSchema =
      oldRaw === newRaw || isSchemaDeepEqual(oldRaw, newRaw);
    // Without a change below this key, neither its own default nor anything
    // nested can differ when the keyed schema and the level's declaration for
    // it are unchanged.
    if (
      !hasChangedBelow &&
      sameKeyedSchema &&
      merger.isValueDeepEqual(
        levelDefault(oldSchema, key),
        levelDefault(newSchema, key)
      )
    ) {
      continue;
    }

    const newResolved = retrieveSchema(
      validator,
      merger,
      newRaw,
      rootSchema,
      current
    );
    const oldResolved =
      sameKeyedSchema && oldCurrent === current
        ? newResolved
        : retrieveSchema(validator, merger, oldRaw, rootSchema, oldCurrent);

    // The changed field and everything below it belongs to the user. The
    // computed defaults are no guide on their own: both sides have to declare a
    // value for the key before a difference between what they compute means the
    // key is stale.
    if (
      !isChangedKey &&
      !hasChangedBelow &&
      !isStub &&
      declaresValueFor(newSchema, key, newResolved) &&
      declaresValueFor(oldSchema, key, oldResolved)
    ) {
      replaceable.push({ key, writtenUnder: newResolved });
    }

    if (isSchemaObjectValue(current) && isSchemaObjectValue(oldCurrent)) {
      nested.push({
        key,
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
    !optionsDeclareProperties(validator, merger, newSchema, rootSchema) &&
    (newSchema === oldSchema ||
      !optionsDeclareProperties(validator, merger, oldSchema, rootSchema))
  ) {
    const replaceableKeys = replaceable.map(({ key }) => key);
    const oldDefaults = levelDefaults(
      merger,
      oldSchema,
      oldProperties,
      replaceableKeys,
      initialDefaultsGenerated
    );
    // The old side decides which keys still hold what the branch being swapped
    // away put there. Once the user has edited them that is none of them, and
    // the new side's defaults are then never computed at all.
    const holdingKeys = replaceableKeys.filter((key) =>
      merger.isValueDeepEqual(
        getOwn(oldDefaults, key),
        getOwn(oldFormData, key)
      )
    );
    if (holdingKeys.length > 0) {
      const newDefaults = levelDefaults(
        merger,
        newSchema,
        newProperties,
        holdingKeys,
        initialDefaultsGenerated
      );
      const holding = new Set(holdingKeys);
      for (const { key, writtenUnder } of replaceable) {
        if (!holding.has(key)) {
          continue;
        }
        const oldDefault = getOwn(oldDefaults, key);
        const newDefault = getOwn(newDefaults, key);
        if (
          newDefault !== undefined &&
          !merger.isValueDeepEqual(oldDefault, newDefault)
        ) {
          if (result === formData) {
            result = { ...formData };
          }
          delete result[key];
          droppedKeys.add(key);
          dropped.push({
            path: [...levelPath, key],
            value: getOwn(oldFormData, key) as FieldValue,
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
    if (isWholeValueSelect(validator, merger, entry.newSchema, rootSchema)) {
      continue;
    }
    const next = dropStaleDefaultsAtLevel(
      validator,
      merger,
      rootSchema,
      entry.newSchema,
      entry.oldSchema,
      entry.current,
      entry.oldCurrent,
      entry.changedPaths,
      droppedPaths,
      [...levelPath, entry.key],
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
export function dropStaleDefaults(
  merger: FormMerger,
  {
    validator,
    rootSchema,
    newSchema,
    formData,
    changes,
    oldFormData: providedOldFormData,
    oldSchema: providedOldSchema,
    droppedPaths,
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
  const oldSchema =
    providedOldSchema ??
    retrieveSchema(validator, merger, rootSchema, rootSchema, oldFormData);
  if (!isSchemaObjectValue(oldSchema)) {
    return { formData, dropped: [] };
  }
  const dropped: DroppedDefault[] = [];
  const nextFormData = dropStaleDefaultsAtLevel(
    validator,
    merger,
    rootSchema,
    newSchema,
    oldSchema,
    formData,
    oldFormData,
    changes.map(({ path }) => path),
    droppedPaths ?? NO_DROPPED_PATHS,
    [],
    initialDefaultsGenerated,
    dropped
  );
  return { formData: nextFormData, dropped };
}
