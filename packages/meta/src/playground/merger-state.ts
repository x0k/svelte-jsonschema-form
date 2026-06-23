import type { FormValue, Schema } from "@sjsf/form";

import { normalizeJsonValue, type Normalize } from "./model.ts";

// NOTE: We use legacy types in combination with `| string`
// to maintain compatibility with old URLs.
// TODO: This should be removed in v4.
export interface MergerState {
  schema: Schema | string;
  deep: boolean;
  intersectJson: boolean;
  deduplicateJsonSchemas: boolean;
  output: Schema | FormValue | string;
}

// TODO: Remove in v4
export type NormalizedMergerState = Normalize<MergerState>;

// TODO: Remove in v4
export function normalizeMergerState(
  state: MergerState
): NormalizedMergerState {
  return {
    ...state,
    schema: normalizeJsonValue(state.schema),
    output: normalizeJsonValue(state.output),
  };
}
