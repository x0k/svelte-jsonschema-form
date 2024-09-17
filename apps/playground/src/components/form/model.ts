import type { Schema } from "./schema/schema";

export interface FieldProps<T> {
  value: T;
  schema: Schema;
  disabled?: boolean;
  readonly?: boolean;
}
