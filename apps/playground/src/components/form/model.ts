import type { JSONSchema7 } from 'json-schema';

export interface FieldProps<T> {
  value: T
  schema: JSONSchema7
  disabled?: boolean
  readonly?: boolean
}
