import type { SchemaArrayValue } from "#core/index.js";
import { SimpleKeyedArray } from "#lib/keyed-array.svelte.js";
import { getOrInsertComputed } from "#lib/map.js";

import {
  copyForChange,
  getValueAtPath,
  updateValueAtPath,
  writeValueAtPath,
} from "./change-path.js";
import type { FieldPath } from "./id.js";
import type { FormValueChange } from "./merger.js";
import type {
  FieldValue,
  FormValue,
  FormValueRef,
  KeyedArraysMap,
  KeyedFieldValues,
} from "./model.js";

/**
 * The form value state. `get` reads the current value reactively; the value
 * commands write through the remaining methods.
 */
export interface FormValueStore {
  get(): FormValue;
  /**
   * Replaces the whole value as-is. Schema defaults are not merged here;
   * `setValue` is the command that merges them.
   */
  replace(value: FormValue): void;
  setAtPath(path: FieldPath, value: FieldValue): void;
  updateAtPath<V extends FieldValue = FieldValue>(
    path: FieldPath,
    update: (value: V) => V
  ): void;
  updateArrayAtPath(
    path: FieldPath,
    update: (array: KeyedFieldValues, length: number) => void
  ): void;
}

export interface FormValueStoreOptions {
  valueRef: FormValueRef;
  keyedArrays: KeyedArraysMap;
  /**
   * Called before a write with the value it replaces, so the defaults pass can
   * tell a user-written value from an untouched default.
   */
  onChange?: (change: FormValueChange) => void;
  onReplace?: () => void;
}

export function createFormValueStore({
  valueRef,
  keyedArrays,
  onChange,
  onReplace,
}: FormValueStoreOptions): FormValueStore {
  let lastKey = Number.MIN_SAFE_INTEGER;

  function getKeyedArray(array: SchemaArrayValue): KeyedFieldValues {
    return getOrInsertComputed(
      keyedArrays,
      array,
      (value) => new SimpleKeyedArray(value, () => lastKey++)
    );
  }

  return {
    get() {
      return valueRef.current;
    },
    replace(value) {
      onReplace?.();
      valueRef.current = value;
    },
    setAtPath(path, value) {
      const current = valueRef.current;
      onChange?.({
        path,
        oldValue: getValueAtPath(current, path),
      });
      const next = writeValueAtPath(current, path, value);
      // Non-root writes mutate the current value in place through Svelte's
      // proxy, so reassigning the same root would only invalidate root readers.
      if (next !== current) {
        valueRef.current = next;
      }
    },
    updateAtPath<V extends FieldValue = FieldValue>(
      path: FieldPath,
      update: (value: V) => V
    ) {
      const current = valueRef.current;
      onChange?.({
        path,
        oldValue: copyForChange(getValueAtPath(current, path)),
      });
      const next = updateValueAtPath(current, path, update);
      if (next !== current) {
        valueRef.current = next;
      }
    },
    updateArrayAtPath(path, update) {
      const current = getValueAtPath(valueRef.current, path);
      if (current === undefined || current === null) {
        const next: SchemaArrayValue = [];
        update(getKeyedArray(next), next.length);
        if (next.length > 0) {
          onChange?.({ path, oldValue: current });
          valueRef.current = writeValueAtPath(valueRef.current, path, next);
        }
        return;
      }
      if (!Array.isArray(current)) {
        throw new Error(
          `Cannot update a non-array value at path "${path.join(".")}"`
        );
      }
      const before = current.slice();
      update(getKeyedArray(current), current.length);
      if (
        current.length !== before.length ||
        current.some((value, index) => value !== before[index])
      ) {
        onChange?.({ path, oldValue: before });
      }
    },
  };
}
