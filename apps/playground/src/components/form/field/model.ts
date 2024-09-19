import type { Schema } from "../schema";

import type { FieldUtils } from "./utils";

export interface FieldProps<T> {
  value: T;
  schema: Schema;
  utils: FieldUtils<T>;
  disabled: boolean;
  readonly: boolean;
}
