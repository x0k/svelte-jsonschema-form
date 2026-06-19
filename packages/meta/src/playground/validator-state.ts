import type { FormValue, Schema, ValidationResult } from "@sjsf/form";

import type { PlaygroundValidator } from "./model.ts";

// NOTE: We use legacy types in combination with `| string`
// to maintain compatibility with old URLs.
// TODO: This should be removed in v4.
export interface ValidatorState {
  schema: Schema | string;
  input: FormValue | string;
  output: ValidationResult<unknown>["errors"] | string;
  validator: PlaygroundValidator;
}
