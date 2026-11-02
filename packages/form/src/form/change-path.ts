import { getOwn, isObject } from "#lib/object.js";

import type { FieldPath } from "./id.js";
import type { FieldValue, FormValue } from "./model.js";

function pathError(path: FieldPath) {
  return new Error(`Path "[${path.join(", ")}]" is not populated`);
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

export function getValueAtPath(
  root: FormValue,
  path: FieldPath,
  level = 0
): FieldValue {
  if (level === path.length) {
    return root;
  }
  if (!isObject(root)) {
    throw pathError(path);
  }
  return getValueAtPath(
    getOwn(root as Record<PropertyKey, unknown>, path[level]!) as FormValue,
    path,
    level + 1
  );
}
