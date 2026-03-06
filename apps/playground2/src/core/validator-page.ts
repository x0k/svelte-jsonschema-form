import type { FormValue, Schema, ValidationResult } from "@sjsf/form";

import type { Validator } from "./validators.js";

export interface ValidatorPageState {
  schema: Schema;
  input: FormValue;
  output: ValidationResult<unknown>["errors"];
  validator: Validator;
}
