import { untrack } from "svelte";

import type { DeepPartial } from "#lib/types.js";

import type { FieldPath } from "../id.js";
import {
  FORM_MERGER,
  FORM_SCHEMA,
  FORM_SET_VALUE_AT_PATH,
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
 * value. Use this for array and object mutations instead of writing into the
 * bound value directly.
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
