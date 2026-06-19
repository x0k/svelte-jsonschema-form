import type { FormValue, Schema, ValidationResult } from "@sjsf/form";

import {
  normalizeJsonValue,
  type Normalize,
  type PlaygroundValidator,
} from "./model.ts";

// NOTE: We use legacy types in combination with `| string`
// to maintain compatibility with old URLs.
// TODO: This should be removed in v4.
export interface ValidatorState {
  schema: Schema | string;
  input: FormValue | string;
  output: ValidationResult<unknown>["errors"] | string;
  validator: PlaygroundValidator;
}

// TODO: Remove in v4
export type NormalizedValidatorState = Normalize<ValidatorState>;

// TODO: Remove in v4
export function normalizeValidatorState(
  state: ValidatorState
): NormalizedValidatorState {
  return {
    ...state,
    schema: normalizeJsonValue(state.schema),
    input: normalizeJsonValue(state.input),
    output: normalizeJsonValue(state.output),
  };
}
