import { untrack } from "svelte";

import type { DeepPartial } from "@/lib/types.js";

import { FORM_MERGER, FORM_SCHEMA, FORM_VALUE } from "../internals.js";
import type { FormValue } from "../model.js";
import type { FormState } from "./state.js";

/**
 * @command
 */
export function setValue<I, O>(ctx: FormState<I, O>, value: DeepPartial<I>) {
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
export function getValueSnapshot<I, O>(ctx: FormState<I, O>): FormValue {
  return $state.snapshot(ctx[FORM_VALUE]);
}
