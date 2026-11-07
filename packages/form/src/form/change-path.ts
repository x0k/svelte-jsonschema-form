import {
  getOwn,
  isArrayIndex,
  isObject,
  isRecord,
  setOwn,
} from "#lib/object.js";

import type { FieldPath } from "./id.js";
import type { FieldValue, FormValue } from "./model.js";

function pathError(path: FieldPath) {
  return new Error(`Path "[${path.join(", ")}]" is not populated`);
}

/** A string that identifies `path` in a set, including keys named `__proto__`. */
export function pathKey(path: readonly (string | number)[]): string {
  return JSON.stringify(path);
}

/** Copies a value before an in-place write, so the previous value stays intact. */
export function copyForChange(value: FieldValue): FieldValue {
  if (Array.isArray(value)) {
    return value.slice();
  }
  if (isObject(value)) {
    return { ...(value as object) };
  }
  return value;
}

export function getValueAtPath(root: FormValue, path: FieldPath): FieldValue {
  let node: unknown = root;
  const last = path.length - 1;
  for (let i = 0; i <= last; i++) {
    const key = path[i]!;
    if (Array.isArray(node)) {
      if (!isArrayIndex(key, node.length)) {
        if (i === last) {
          return undefined;
        }
        throw pathError(path);
      }
      node = getOwn(node, key);
    } else if (isRecord(node)) {
      node = getOwn(node, key);
    } else {
      throw pathError(path);
    }
  }
  return node as FieldValue;
}

export function writeValueAtPath(
  root: FormValue,
  path: FieldPath,
  value: FieldValue
): FormValue {
  if (path.length === 0) {
    return value;
  }
  let node = root as unknown as Record<PropertyKey, unknown>;
  const last = path.length - 1;
  for (let i = 0; i < last; i++) {
    node = getOwn(node, path[i]!) as Record<PropertyKey, unknown>;
  }
  setOwn(node, path[last]!, value);
  return root;
}

export function updateValueAtPath<V extends FieldValue>(
  root: FormValue,
  path: FieldPath,
  update: (value: V) => V
): FormValue {
  if (path.length === 0) {
    return update(root as V);
  }
  let node: unknown = root;
  const last = path.length - 1;
  for (let i = 0; i < last; i++) {
    const key = path[i]!;
    if (Array.isArray(node)) {
      if (!isArrayIndex(key, node.length)) {
        throw pathError(path);
      }
      node = getOwn(node, key);
    } else if (isRecord(node)) {
      node = getOwn(node, key);
    } else {
      throw pathError(path);
    }
  }
  const key = path[last]!;
  let current: FieldValue;
  if (Array.isArray(node)) {
    current = isArrayIndex(key, node.length)
      ? (getOwn(node, key) as FieldValue)
      : undefined;
  } else if (isRecord(node)) {
    current = getOwn(node, key) as FieldValue;
  } else {
    throw pathError(path);
  }
  const next = update(current as V);
  if (next !== current) {
    setOwn(node as Record<PropertyKey, unknown>, key, next);
  }
  return root;
}
