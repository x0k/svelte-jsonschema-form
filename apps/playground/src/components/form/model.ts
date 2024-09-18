import type { Schema, Validator } from './schema';

export interface FieldProps<T> {
  value: T;
  schema: Schema;
  validator: Validator<T>
  disabled?: boolean;
  readonly?: boolean;
}
