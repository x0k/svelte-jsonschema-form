/**
 * Removes values that still hold a swapped-away `dependencies` or
 * `if`/`then`/`else` branch's declared default, so the next defaults fill
 * writes the newly selected branch's declaration.
 *
 * The form records the values its writes replaced, so this pass can resolve
 * the schema against the data as it was before the change and leave a value the
 * user edited alone even when it equals the old default.
 */

import {
  ADDITIONAL_PROPERTY_FLAG,
  isSchemaDeepEqual,
  isSchemaObjectValue,
  retrieveSchema,
  type Merger,
  type Schema,
  type SchemaObjectValue,
  type SchemaValue,
  type Validator,
} from "#core/index.js";
import { getOwn, isObject, setOwn } from "#lib/object.js";

import { pathKey } from "./change-path.js";
import type { FieldPath } from "./id.js";
import type { DropStaleDefaultsOptions, FormValueChange } from "./merger.js";
import type { FieldValue, FormValue } from "./model.js";

function isSchemaObject(value: unknown): value is Schema {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function levelDefault(levelSchema: Schema, key: string) {
  const declared = levelSchema.default;
  return isSchemaObjectValue(declared) && Object.hasOwn(declared, key)
    ? getOwn(declared, key)
    : undefined;
}

function getDeclaredDefault(levelSchema: Schema, key: string, schema: Schema) {
  // A declared `null` is a value, not an absent declaration, so test for the
  // property rather than its truthiness.
  if (Object.hasOwn(schema, "const")) {
    return schema.const;
  }
  if (Object.hasOwn(schema, "default")) {
    return schema.default;
  }
  return levelDefault(levelSchema, key);
}

function isPathPrefix(
  prefix: readonly (string | number)[],
  path: readonly (string | number)[]
) {
  return (
    prefix.length <= path.length &&
    prefix.every((part, index) => part === path[index])
  );
}

function copyContainer(
  value: unknown,
  nextKey: FieldPath[number]
): Record<PropertyKey, unknown> {
  if (Array.isArray(value)) {
    return value.slice() as unknown as Record<PropertyKey, unknown>;
  }
  if (isObject(value)) {
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
  path: FieldPath,
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

function dropStaleDefaultsAtLevel(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaObjectValue,
  oldFormData: SchemaObjectValue,
  changedPaths: readonly FieldPath[],
  droppedPaths: ReadonlySet<string>,
  levelPath: FieldPath,
  level: number
): SchemaObjectValue {
  const newProperties = newSchema.properties;
  const oldProperties = oldSchema.properties;
  if (
    !isSchemaObjectValue(newProperties) ||
    !isSchemaObjectValue(oldProperties)
  ) {
    return formData;
  }

  let result = formData;
  for (const key of Object.keys(newProperties)) {
    if (!Object.hasOwn(oldProperties, key)) {
      continue;
    }
    const currentPath = [...levelPath, key] as unknown as FieldPath;
    if (droppedPaths.has(pathKey(currentPath))) {
      continue;
    }
    const newRaw = newProperties[key];
    const oldRaw = oldProperties[key];
    if (!isSchemaObject(newRaw) || !isSchemaObject(oldRaw)) {
      continue;
    }
    const current = getOwn(result, key);
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

    const oldDefault = getDeclaredDefault(oldSchema, key, oldResolved);
    const newDefault = getDeclaredDefault(newSchema, key, newResolved);
    // `oldCurrent` is the value before the batch, so a change below the key can
    // make the current value differ from it. Do not drop the property when any
    // change touches it or a value below it.
    if (
      !isChangedKey &&
      !hasChangedBelow &&
      !isStub &&
      oldDefault !== undefined &&
      newDefault !== undefined &&
      !merger.isValueDeepEqual(oldDefault, newDefault) &&
      merger.isValueDeepEqual(oldDefault, oldCurrent)
    ) {
      if (result === formData) {
        result = { ...formData };
      }
      delete result[key];
      continue;
    }

    if (isSchemaObjectValue(current) && isSchemaObjectValue(oldCurrent)) {
      const nextChangedPaths = changedPaths.filter(
        (path) =>
          isPathPrefix(path, currentPath) || isPathPrefix(currentPath, path)
      );
      const next = dropStaleDefaultsAtLevel(
        validator,
        merger,
        rootSchema,
        newResolved,
        oldResolved,
        current,
        oldCurrent,
        nextChangedPaths,
        droppedPaths,
        currentPath,
        level + 1
      );
      if (next !== current) {
        if (result === formData) {
          result = { ...formData };
        }
        setOwn(result, key, next);
      }
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
  merger: Merger,
  {
    validator,
    rootSchema,
    newSchema,
    formData,
    changes,
    oldFormData: providedOldFormData,
    oldSchema: providedOldSchema,
    droppedPaths,
  }: DropStaleDefaultsOptions
): SchemaValue | undefined {
  if (!isSchemaObjectValue(formData) || !isSchemaObjectValue(newSchema)) {
    return formData;
  }
  const oldFormData =
    providedOldFormData ?? rebuildOldFormData(formData, changes);
  if (!isSchemaObjectValue(oldFormData)) {
    return formData;
  }
  const oldSchema =
    providedOldSchema ??
    retrieveSchema(validator, merger, rootSchema, rootSchema, oldFormData);
  if (!isSchemaObjectValue(oldSchema)) {
    return formData;
  }
  return dropStaleDefaultsAtLevel(
    validator,
    merger,
    rootSchema,
    newSchema,
    oldSchema,
    formData,
    oldFormData,
    changes.map(({ path }) => path),
    new Set((droppedPaths ?? []).map(pathKey)),
    [] as unknown as FieldPath,
    0
  );
}
