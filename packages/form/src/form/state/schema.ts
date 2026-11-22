import { CORE_MERGER } from "#core/internals.js";

import { FORM_MARK_SCHEMA_CHANGE } from "../internals.js";
import type { MergeFormDataAndSchemaDefaultsOptions } from "../merger.js";
import type { FormState } from "./state.js";

/**
 * @query
 */
export function getDefaultFieldState<T>(
  ctx: FormState<T>,
  options: MergeFormDataAndSchemaDefaultsOptions
) {
  return ctx[CORE_MERGER].mergeFormDataAndSchemaDefaults(options);
}

export function markSchemaChange<T>(ctx: FormState<T>) {
  ctx[FORM_MARK_SCHEMA_CHANGE]();
}
