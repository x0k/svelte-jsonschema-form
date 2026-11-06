import type { SchemaArrayValue } from "#core/index.js";
import { SimpleKeyedArray } from "#lib/keyed-array.svelte.js";
import { getOrInsertComputed } from "#lib/map.js";

import {
  getValueAtPath,
  updateValueAtPath,
  writeValueAtPath,
} from "./change-path.js";
import type { FieldPath } from "./id.js";
import type {
  FieldValue,
  FormValue,
  FormValueRef,
  KeyedArraysMap,
  KeyedFieldValues,
} from "./model.js";

/**
 * The form value state. `get` reads the current value reactively, and the
 * remaining methods are the only write primitives for it.
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

export function createFormValueStore({
  valueRef,
  keyedArrays,
}: {
  valueRef: FormValueRef;
  keyedArrays: KeyedArraysMap;
}): FormValueStore {
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
      valueRef.current = value;
    },
    setAtPath(path, value) {
      valueRef.current = writeValueAtPath(valueRef.current, path, value);
    },
    updateAtPath<V extends FieldValue = FieldValue>(
      path: FieldPath,
      update: (value: V) => V
    ) {
      valueRef.current = updateValueAtPath(valueRef.current, path, update);
    },
    updateArrayAtPath(path, update) {
      const current = getValueAtPath(valueRef.current, path);
      if (current === undefined || current === null) {
        const next: SchemaArrayValue = [];
        update(getKeyedArray(next), next.length);
        if (next.length > 0) {
          valueRef.current = writeValueAtPath(valueRef.current, path, next);
        }
        return;
      }
      if (!Array.isArray(current)) {
        throw new Error(
          `Cannot update a non-array value at path "${path.join(".")}"`
        );
      }
      update(getKeyedArray(current), current.length);
    },
  };
}
