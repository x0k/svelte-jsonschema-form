import { untrack } from "svelte";

import type { DeepPartial } from "#lib/types.js";

import type { FieldPath } from "../id.js";
import {
  FORM_MERGER,
  FORM_SCHEMA,
  FORM_SET_VALUE_AT_PATH,
  FORM_VALUE,
} from "../internals.js";
import type { FieldValue, FormValue } from "../model.js";
import type { FormState } from "./state.js";

/**
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
