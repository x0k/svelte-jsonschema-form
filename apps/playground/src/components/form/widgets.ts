import type { Component as SvelteComponent } from "svelte";
import type { FullAutoFill, HTMLAttributes } from "svelte/elements";

import type { Schema, SchemaValue } from "./schema";
import type { UiSchema } from "./ui-schema";
import type { EnumOption } from "./enum";

export interface WidgetCommonProps<V> extends HTMLAttributes<HTMLElement> {
  value: V | undefined;
  schema: Schema;
  uiSchema: UiSchema;
  id: string;
  label: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  autofocus: boolean;
  placeholder: string;
  autocomplete: FullAutoFill | undefined;
  onfocus: () => void;
  onblur: () => void;
  // hideError: boolean;
  // hideLabel: boolean;
  // rawErrors: string[];
}

export interface SelectWidgetProps<V> extends WidgetCommonProps<V> {
  options: EnumOption<SchemaValue>[];
}

export interface WidgetsAndProps<V> {
  text: WidgetCommonProps<V>;
  textarea: WidgetCommonProps<V>;
  number: WidgetCommonProps<V>;
  select: SelectWidgetProps<V>;
  checkbox: WidgetCommonProps<V>;
}

export interface WidgetValue {
  text: string;
  textarea: string;
  number: number;
  select: SchemaValue;
  checkbox: boolean;
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
