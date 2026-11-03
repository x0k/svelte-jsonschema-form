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
  isSchemaDeepEqual,
  isSchemaObjectValue,
  isSchemaValueDeepEqual,
  retrieveSchema,
  type Merger,
  type Schema,
  type SchemaObjectValue,
  type SchemaValue,
  type Validator,
} from "#core/index.js";
import { getOwn, isObject, setOwn } from "#lib/object.js";

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
  return schema.const ?? schema.default ?? levelDefault(levelSchema, key);
}

function isChangedAtLevel(
  changedPaths: readonly FieldPath[],
  level: number,
  key: string
) {
  return changedPaths.some(
    (path) => path.length <= level || path[level] === key
  );
}

/**
 * A change recorded at a container path owns the whole subtree below it. Keep
 * such paths while descending so nested defaults are not mistaken for values
 * that still belong to the previous branch.
 */
function changesBelow(
  changedPaths: readonly FieldPath[],
  level: number,
  key: string
) {
  return changedPaths.filter(
    (path) => path.length <= level || path[level] === key
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
    return { ...(value as object) };
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
function replaceAtPath(
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

function rebuildOldFormData(
  formData: SchemaValue,
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

    const isChangedKey = isChangedAtLevel(changedPaths, level, key);
    const sameKeyedSchema =
      oldRaw === newRaw || isSchemaDeepEqual(oldRaw, newRaw);
    // Without a change below this key, neither its own default nor anything
    // nested can differ when the keyed schema and the level's declaration for
    // it are unchanged.
    if (
      !isChangedKey &&
      sameKeyedSchema &&
      isSchemaValueDeepEqual(
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
    if (
      !isChangedKey &&
      oldDefault !== undefined &&
      newDefault !== undefined &&
      !isSchemaValueDeepEqual(oldDefault, newDefault) &&
      isSchemaValueDeepEqual(oldDefault, oldCurrent)
    ) {
      if (result === formData) {
        result = { ...formData };
      }
      delete result[key];
      continue;
    }

    if (isSchemaObjectValue(current) && isSchemaObjectValue(oldCurrent)) {
      const nextChangedPaths = changesBelow(changedPaths, level, key);
      const next = dropStaleDefaultsAtLevel(
        validator,
        merger,
        rootSchema,
        newResolved,
        oldResolved,
        current,
        oldCurrent,
        nextChangedPaths,
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
  }: DropStaleDefaultsOptions
): SchemaValue | undefined {
  if (!isSchemaObjectValue(formData) || !isSchemaObjectValue(newSchema)) {
    return formData;
  }
  const oldFormData = rebuildOldFormData(formData, changes);
  if (!isSchemaObjectValue(oldFormData)) {
    return formData;
  }
  const oldSchema = retrieveSchema(
    validator,
    merger,
    rootSchema,
    rootSchema,
    oldFormData
  );
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
    0
  );
}
