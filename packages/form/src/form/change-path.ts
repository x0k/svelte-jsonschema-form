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
    return { ...value };
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

interface ResolvedPath {
  parent: unknown[] | Record<PropertyKey, unknown>;
  key: FieldPath[number];
}

/**
 * Resolves the parent of the last path segment using the same rules as
 * `getValueAtPath`: arrays accept only integer indices in bounds, and
 * intermediate values must be arrays or plain objects.
 */
function resolveParent(root: FormValue, path: FieldPath): ResolvedPath {
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
  if (Array.isArray(node)) {
    return { parent: node, key: path[last]! };
  }
  if (isRecord(node)) {
    return { parent: node, key: path[last]! };
  }
  throw pathError(path);
}

export function writeValueAtPath(
  root: FormValue,
  path: FieldPath,
  value: FieldValue
): FormValue {
  if (path.length === 0) {
    return value;
  }
  const { parent, key } = resolveParent(root, path);
  if (Array.isArray(parent) && !isArrayIndex(key, parent.length)) {
    throw pathError(path);
  }
  setOwn(parent as Record<PropertyKey, unknown>, key, value);
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
  const { parent, key } = resolveParent(root, path);
  if (Array.isArray(parent) && !isArrayIndex(key, parent.length)) {
    throw pathError(path);
  }
  const parentRecord = parent as Record<PropertyKey, unknown>;
  const current = getOwn(parentRecord, key) as FieldValue;
  const next = update(current as V);
  if (next !== current) {
    setOwn(parentRecord, key, next);
  }
  return root;
}
