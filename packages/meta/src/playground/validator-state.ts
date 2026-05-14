import type { FormValue, Schema, ValidationResult } from "@sjsf/form";

import type { PlaygroundValidator } from "./validators.ts";

export interface ValidatorState {
  schema: Schema;
  input: FormValue;
  output: ValidationResult<unknown>["errors"];
  validator: PlaygroundValidator;
}
