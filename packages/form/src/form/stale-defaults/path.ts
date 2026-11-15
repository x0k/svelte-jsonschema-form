import {
  isSchemaArrayValue,
  isSchemaObjectValue,
  type RPath,
  type SchemaArrayValue,
  type SchemaObjectValue,
  type SchemaValue,
} from "#core/index.js";
import { getOwn, getValueByPath, setOwn } from "#lib/object.js";

import type { FormValueChange } from "../merger.js";
import type { FieldValue, FormValue } from "../model.js";

function copyContainer(
  value: FormValue,
  nextKey: RPath[number]
): SchemaObjectValue | SchemaArrayValue {
  if (isSchemaArrayValue(value)) {
    return value.slice();
  }
  if (isSchemaObjectValue(value)) {
    return { ...value };
  }
  if (value === undefined || value === null) {
    return typeof nextKey === "number" ? [] : {};
  }
  throw new Error("Cannot rebuild data through a primitive value");
}

function getChild(container: FormValue, key: RPath[number]): FieldValue {
  if (isSchemaArrayValue(container)) {
    return typeof key === "number" ? container[key] : undefined;
  }
  if (isSchemaObjectValue(container)) {
    return typeof key === "string" ? getOwn(container, key) : undefined;
  }
  return undefined;
}

function writeChild(
  container: SchemaObjectValue | SchemaArrayValue,
  key: RPath[number],
  value: FieldValue
): void {
  if (isSchemaArrayValue(container)) {
    if (typeof key !== "number") {
      throw new Error("Cannot write a non-numeric key to an array");
    }
    container[key] = value;
  } else if (typeof key !== "string") {
    throw new Error("Cannot write a non-string key to an object");
  } else {
    setOwn(container, key, value);
  }
}

/**
 * Copies the containers along `path`, linking each copy to the next. The copy
 * at index `i` is the one that holds `path[i]`, so the last copy is the parent
 * of the final key.
 */
function copyAlongPath(
  root: FormValue,
  path: RPath
): (SchemaObjectValue | SchemaArrayValue)[] {
  const copies: (SchemaObjectValue | SchemaArrayValue)[] = [];
  let node = root;
  for (let i = 0; i < path.length; i++) {
    const key = path[i]!;
    const copy = copyContainer(node, key);
    if (i > 0) {
      writeChild(copies[i - 1]!, path[i - 1]!, copy);
    }
    copies.push(copy);
    node = getChild(node, key);
  }
  return copies;
}

/** Puts `value` back at `path`, copying only the containers along the path. */
export function replaceAtPath(
  root: FormValue,
  path: RPath,
  value: FieldValue
): FormValue {
  if (path.length === 0) {
    return value;
  }
  const copies = copyAlongPath(root, path);
  writeChild(copies[copies.length - 1]!, path[path.length - 1]!, value);
  return copies[0]!;
}

/** Removes the own property at `path`, copying only the containers along it. */
export function deleteAtPath(root: FormValue, path: RPath): FormValue {
  if (path.length === 0) {
    return undefined;
  }
  const parentPath = path.slice(0, -1);
  const parent =
    parentPath.length === 0
      ? root
      : getValueByPath<FormValue, FieldValue>(root, parentPath);
  if (!isSchemaObjectValue(parent)) {
    return root;
  }
  const key = path[path.length - 1]!;
  if (typeof key !== "string") {
    throw new Error("Cannot delete a non-string key from an object");
  }
  const copies = copyAlongPath(root, path);
  Reflect.deleteProperty(copies[copies.length - 1]!, key);
  return copies[0]!;
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
  let oldFormData = formData;
  for (let i = changes.length - 1; i >= 0; i--) {
    const change = changes[i]!;
    oldFormData =
      change.hadOwnValue === false
        ? deleteAtPath(oldFormData, change.path)
        : replaceAtPath(oldFormData, change.path, change.oldValue);
  }
  return oldFormData;
}
