import type { Schema } from "./schema";

export interface FieldProps<T> {
  value: T;
  schema: Schema;
  disabled?: boolean;
  readonly?: boolean;
}
