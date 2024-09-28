import type { Component as SvelteComponent } from "svelte";
import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { SchemaArrayValue, SchemaValue } from "./schema";
import type { EnumOption } from "./enum";

export interface RequiredAttributes {
  id: string;
  name: string;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  onfocus: () => void;
  onblur: () => void;
}

export interface WidgetCommonProps<V, A> {
  label: string;
  value: V | undefined;
  attributes: A & RequiredAttributes;
}

export interface SelectWidgetProps<V>
  extends WidgetCommonProps<V, HTMLSelectAttributes> {
  options: EnumOption<SchemaValue>[];
}

export interface RadioWidgetProps<V>
  extends WidgetCommonProps<V, HTMLInputAttributes> {
  options: EnumOption<SchemaValue>[];
}

export interface WidgetsAndProps<V> {
  text: WidgetCommonProps<V, HTMLInputAttributes>;
  textarea: WidgetCommonProps<V, HTMLTextareaAttributes>;
  number: WidgetCommonProps<V, HTMLInputAttributes>;
  select: SelectWidgetProps<V>;
  radio: RadioWidgetProps<V>;
  checkbox: WidgetCommonProps<V, HTMLInputAttributes>;
  checkboxes: RadioWidgetProps<V>;
}

export interface WidgetValue {
  text: string;
  textarea: string;
  number: number;
  select: SchemaValue;
  radio: SchemaValue;
  checkbox: boolean;
  checkboxes: SchemaArrayValue;
}

export type WidgetType = keyof WidgetsAndProps<SchemaValue>;

export type WidgetProps<T extends WidgetType> = WidgetsAndProps<
  WidgetValue[T]
>[T];

export type Widget<T extends WidgetType> = SvelteComponent<
  WidgetProps<T>,
  {},
  "value"
>;

export type CompatibleWidgetType<T extends WidgetType> = {
  [W in WidgetType]: WidgetValue[T] extends WidgetValue[W] ? W : never;
}[WidgetType];

export type Widgets = <T extends WidgetType>(
  type: T
) => Widget<CompatibleWidgetType<T>> | undefined;
