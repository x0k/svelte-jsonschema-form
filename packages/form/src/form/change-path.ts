import type { FieldPath } from "./id.js";
import type { FieldValue, FormValue } from "./model.js";

function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null;
}

function pathError(path: FieldPath) {
  return new Error(`Path "[${path.join(", ")}]" is not populated`);
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
  return getValueAtPath(root[path[level]!] as FormValue, path, level + 1);
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
  copy[key] = replaceAtPath(source?.[key] as FormValue, path, value, level + 1);
  return copy as FormValue;
}
