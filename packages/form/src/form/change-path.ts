import { getOwn, isObject, isRecord } from "#lib/object.js";
import { snapshotWithSymbols } from "#lib/svelte.svelte.js";

import type { FieldPath } from "./id.js";
import type { FormValueChange } from "./merger.js";
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

/**
 * Reads every nested value and returns an independent plain copy.
 *
 * Unlike `$state.snapshot`, this keeps prototype-named keys as own properties
 * and leaves non-plain values such as `File` or `Date` untouched. Reading the
 * copy inside an effect also subscribes it to nested writes.
 */
export function snapshotFormValue(value: FormValue): FormValue {
  return snapshotWithSymbols(value);
}

type ValueDeepComparator = (a: FieldValue, b: FieldValue) => boolean;

function collectValueChangesAtPath(
  isEqual: ValueDeepComparator,
  oldValue: FieldValue,
  newValue: FieldValue,
  path: readonly (string | number)[],
  changes: FormValueChange[]
) {
  if (isEqual(oldValue, newValue)) {
    return;
  }
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    // Index-based diffing is ambiguous after a length change (splice/shift),
    // so record the whole array and mark its subtree as changed.
    if (oldValue.length !== newValue.length) {
      changes.push({ path: path as FieldPath, oldValue });
      return;
    }
    for (let i = 0; i < newValue.length; i++) {
      collectValueChangesAtPath(
        isEqual,
        oldValue[i],
        newValue[i],
        [...path, i],
        changes
      );
    }
    return;
  }
  if (isRecord<FieldValue>(oldValue) && isRecord<FieldValue>(newValue)) {
    const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    for (const key of keys) {
      collectValueChangesAtPath(
        isEqual,
        getOwn(oldValue, key),
        getOwn(newValue, key),
        [...path, key],
        changes
      );
    }
    return;
  }
  changes.push({ path: path as FieldPath, oldValue });
}

/**
 * Compares two form value snapshots and returns the paths whose values differ,
 * together with the value each path had in `oldValue`.
 *
 * When a container cannot be compared key by key (an array changed length or a
 * container changed type), the container itself is reported so the old data can
 * be rebuilt without guessing how indices shifted.
 */
export function collectValueChanges(
  isEqual: ValueDeepComparator,
  oldValue: FormValue,
  newValue: FormValue
): FormValueChange[] {
  const changes: FormValueChange[] = [];
  collectValueChangesAtPath(isEqual, oldValue, newValue, [], changes);
  return changes;
}
