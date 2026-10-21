import type { FieldPath } from "./id.js";
import type { FieldValue, FormValue } from "./model.js";

function copyContainer(value: unknown, nextKey: FieldPath[number]) {
  if (Array.isArray(value)) {
    return value.slice();
  }
  if (typeof value === "object" && value !== null) {
    return { ...value };
  }
  return typeof nextKey === "number" ? [] : {};
}

/** Puts `value` back at `path`, copying only the containers along the path. */
export function replaceAtPath(
  root: FormValue,
  path: FieldPath,
  value: FieldValue
): FormValue {
  if (path.length === 0) {
    return value;
  }
  const key = path[0]!;
  const source = root as Record<PropertyKey, unknown> | undefined;
  const copy = copyContainer(source, key) as Record<PropertyKey, unknown>;
  copy[key] = replaceAtPath(
    source?.[key] as FormValue,
    path.slice(1) as unknown as FieldPath,
    value
  );
  return copy as FormValue;
}
