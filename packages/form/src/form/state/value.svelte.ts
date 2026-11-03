import { untrack } from "svelte";

import type { DeepPartial } from "#lib/types.js";

import type { FieldPath } from "../id.js";
import {
  FORM_MERGER,
  FORM_SCHEMA,
  FORM_SET_VALUE_AT_PATH,
  FORM_UPDATE_ARRAY_AT_PATH,
  FORM_UPDATE_VALUE_AT_PATH,
  FORM_VALUE,
} from "../internals.js";
import type { FieldValue, FormValue } from "../model.js";
import type { FormState } from "./state.js";

/**
 * Writes `value` at `path` and records the previous value, so conditional
 * defaults can be sanitized against the data as it was before the change.
 *
 * @command
 */
export function setValueAtPath<T>(
  ctx: FormState<T>,
  path: FieldPath,
  value: FieldValue
) {
  untrack(() => {
    ctx[FORM_SET_VALUE_AT_PATH](path, value);
  });
}

/**
 * Applies `update` to the value at `path` in place and records the previous
 * value. Use this for object mutations or array element replacement instead of
 * writing into the bound value directly. Use the array commands for structural
 * array changes that must keep item keys in sync.
 *
 * The recorded value is a shallow copy, so `update` should only replace
 * properties or elements of the container it receives.
 *
 * @command
 */
export function updateValueAtPath<T>(
  ctx: FormState<T>,
  path: FieldPath,
  update: (value: FieldValue) => FieldValue
) {
  untrack(() => {
    ctx[FORM_UPDATE_VALUE_AT_PATH](path, update);
  });
}

/**
 * Inserts `value` into the array at `path` and records the previous value.
 * Appends to the end when `index` is omitted.
 *
 * @command
 */
export function insertArrayItem<T>(
  ctx: FormState<T>,
  path: FieldPath,
  value: FieldValue,
  index?: number
) {
  untrack(() => {
    ctx[FORM_UPDATE_ARRAY_AT_PATH](path, (array) => {
      if (index === undefined) {
        array.push(value);
      } else if (index >= 0 && index <= array.length) {
        array.insert(index, value);
      }
    });
  });
}

/**
 * Removes the item at `index` from the array at `path` and records the
 * previous value. Does nothing when `index` is out of bounds.
 *
 * @command
 */
export function removeArrayItem<T>(
  ctx: FormState<T>,
  path: FieldPath,
  index: number
) {
  untrack(() => {
    ctx[FORM_UPDATE_ARRAY_AT_PATH](path, (array) => {
      if (index >= 0 && index < array.length) {
        array.remove(index);
      }
    });
  });
}

/**
 * Moves the item at `from` to `to` in the array at `path`, shifting the items
 * between them, and records the previous value. Does nothing when either index
 * is out of bounds.
 *
 * @command
 */
export function moveArrayItem<T>(
  ctx: FormState<T>,
  path: FieldPath,
  from: number,
  to: number
) {
  untrack(() => {
    ctx[FORM_UPDATE_ARRAY_AT_PATH](path, (array) => {
      if (
        from === to ||
        from < 0 ||
        from >= array.length ||
        to < 0 ||
        to >= array.length
      ) {
        return;
      }
      if (from < to) {
        for (let i = from; i < to; i++) {
          array.swap(i, i + 1);
        }
      } else {
        for (let i = from; i > to; i--) {
          array.swap(i, i - 1);
        }
      }
    });
  });
}

/**
 * Swaps the items at `a` and `b` in the array at `path` and records the
 * previous value. Does nothing when either index is out of bounds.
 *
 * @command
 */
export function swapArrayItems<T>(
  ctx: FormState<T>,
  path: FieldPath,
  a: number,
  b: number
) {
  untrack(() => {
    ctx[FORM_UPDATE_ARRAY_AT_PATH](path, (array) => {
      if (a !== b && a >= 0 && a < array.length && b >= 0 && b < array.length) {
        array.swap(a, b);
      }
    });
  });
}

/**
 * @command
 */
export function setValue<T>(ctx: FormState<T>, value: DeepPartial<T>) {
  untrack(() => {
    ctx[FORM_VALUE] = ctx[FORM_MERGER].mergeFormDataAndSchemaDefaults({
      formData: value as FormValue,
      schema: ctx[FORM_SCHEMA],
      initialDefaultsGenerated: true,
    });
  });
}

/**
 * @query
 */
export function getValueSnapshot<T>(ctx: FormState<T>): FormValue {
  return $state.snapshot(ctx[FORM_VALUE]);
}
