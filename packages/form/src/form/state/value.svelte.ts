import { untrack } from "svelte";

import type { RPath } from "#core/index.js";
import type { DeepPartial } from "#lib/types.js";

import { FORM_MERGER, FORM_SCHEMA, FORM_VALUE } from "../internals.js";
import type { FieldValue, FormValue, KeyedFieldValues } from "../model.js";
import { getFieldPath } from "./path-internal.js";
import type { FormState } from "./state.js";

function updateArray<T>(
  ctx: FormState<T>,
  path: RPath,
  update: (array: KeyedFieldValues, length: number) => void
) {
  untrack(() => {
    ctx[FORM_VALUE].updateArrayAtPath(getFieldPath(ctx, path), update);
  });
}

/**
 * Replaces the value at `path`. Accepts a plain `RPath` or an already
 * registered `FieldPath`; the latter skips the path lookup.
 *
 * @command
 */
export function setValueAtPath<T>(
  ctx: FormState<T>,
  path: RPath,
  value: FieldValue
) {
  untrack(() => {
    ctx[FORM_VALUE].setAtPath(getFieldPath(ctx, path), value);
  });
}

/**
 * Applies `update` to the value at `path` in place. Use this for object
 * mutations or array element replacement. Use the array commands for structural
 * array changes that must keep item keys in sync.
 *
 * @command
 */
export function updateValueAtPath<T, V extends FieldValue = FieldValue>(
  ctx: FormState<T>,
  path: RPath,
  update: (value: V) => V
) {
  untrack(() => {
    ctx[FORM_VALUE].updateAtPath(getFieldPath(ctx, path), update);
  });
}

/**
 * Inserts `value` into the array at `path`. Appends to the end when `index` is
 * omitted. Does nothing when `index` is not an integer or is out of bounds.
 *
 * @command
 */
export function insertArrayItem<T>(
  ctx: FormState<T>,
  path: RPath,
  value: FieldValue,
  index?: number
) {
  updateArray(ctx, path, (array, length) => {
    if (index === undefined) {
      array.push(value);
    } else if (Number.isInteger(index) && index >= 0 && index <= length) {
      array.insert(index, value);
    }
  });
}

/**
 * Removes the item at `index` from the array at `path`. Does nothing when
 * `index` is not an integer or is out of bounds.
 *
 * @command
 */
export function removeArrayItem<T>(
  ctx: FormState<T>,
  path: RPath,
  index: number
) {
  updateArray(ctx, path, (array, length) => {
    if (Number.isInteger(index) && index >= 0 && index < length) {
      array.remove(index);
    }
  });
}

/**
 * Moves the item at `from` to `to` in the array at `path`, shifting the items
 * between them. Does nothing when either index is not an integer or is out of
 * bounds.
 *
 * @command
 */
export function moveArrayItem<T>(
  ctx: FormState<T>,
  path: RPath,
  from: number,
  to: number
) {
  updateArray(ctx, path, (array, length) => {
    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      from === to ||
      from < 0 ||
      from >= length ||
      to < 0 ||
      to >= length
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
}

/**
 * Swaps the items at `a` and `b` in the array at `path`. Does nothing when
 * either index is not an integer or is out of bounds.
 *
 * @command
 */
export function swapArrayItems<T>(
  ctx: FormState<T>,
  path: RPath,
  a: number,
  b: number
) {
  updateArray(ctx, path, (array, length) => {
    if (
      Number.isInteger(a) &&
      Number.isInteger(b) &&
      a !== b &&
      a >= 0 &&
      a < length &&
      b >= 0 &&
      b < length
    ) {
      array.swap(a, b);
    }
  });
}

/**
 * Replaces the whole form value, merging schema defaults into it.
 * Additional-properties defaults are not generated.
 *
 * @command
 */
export function setValue<T>(ctx: FormState<T>, value: DeepPartial<T>) {
  untrack(() => {
    ctx[FORM_VALUE].replace(
      ctx[FORM_MERGER].mergeFormDataAndSchemaDefaults({
        formData: value as FormValue,
        schema: ctx[FORM_SCHEMA],
        initialDefaultsGenerated: true,
      })
    );
  });
}

/**
 * @query
 */
export function getValueSnapshot<T>(ctx: FormState<T>): FormValue {
  return $state.snapshot(ctx[FORM_VALUE].get());
}
