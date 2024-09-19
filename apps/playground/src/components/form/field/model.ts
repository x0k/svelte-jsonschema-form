import type { Schema } from "../schema";
import type { UiSchema } from "../ui-schema";

import type { FieldUtils } from "./utils";

export interface FieldProps<T> {
  value: T;
  schema: Schema;
  uiSchema: UiSchema;
  utils: FieldUtils<T>;
  disabled: boolean;
  readonly: boolean;
}
