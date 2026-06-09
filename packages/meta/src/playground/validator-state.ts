import type { FormValue, Schema, ValidationResult } from "@sjsf/form";

import type { PlaygroundValidator } from "./model.ts";

export interface ValidatorState {
  schema: Schema;
  input: FormValue;
  output: ValidationResult<unknown>["errors"];
  validator: PlaygroundValidator;
}
