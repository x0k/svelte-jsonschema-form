import type { Schema } from "../schema";
import type { UiSchema } from "../ui-schema";

export interface FieldProps<T> {
  value: T;
  schema: Schema;
  uiSchema: UiSchema;
}
