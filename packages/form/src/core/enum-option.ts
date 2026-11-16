import type { Schema } from "./schema.js";

export interface SimpleEnumOption<T> {
  id: string;
  value: T;
  label: string;
  disabled: boolean;
  /**
   * Description of the option, rendered while it is selected.
   */
  description?: string;
}

export interface ComplexEnumOption<T> extends SimpleEnumOption<T> {
  schema: Schema;
}

export type EnumOption<T> = SimpleEnumOption<T> | ComplexEnumOption<T>;
