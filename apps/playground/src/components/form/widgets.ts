import type { Component as SvelteComponent } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { Schema } from "./schema";
import type { UiSchema } from "./ui-schema";

export interface WidgetCommonProps<V> extends HTMLAttributes<HTMLElement> {
  id: string;
  schema: Schema;
  uiSchema: UiSchema;
  value: V;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hideError?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  hideLabel?: boolean;
  rawErrors?: string[];
}

export interface WidgetsAndProps {
  text: {};
}

export interface WidgetValue {
  text: string;
}

export type WidgetType = keyof WidgetsAndProps;

export type WidgetProps<T extends WidgetType> = WidgetsAndProps[T] &
  WidgetCommonProps<WidgetValue[T]>;

export type Widget<T extends WidgetType> = SvelteComponent<
  WidgetProps<T>,
  {},
  "value"
>;

export type Widgets = <T extends WidgetType>(type: T) => Widget<T>;
