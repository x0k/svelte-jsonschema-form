import type { Component as SvelteComponent } from "svelte";
import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { SchemaArrayValue, SchemaValue } from "./schema";
import type { EnumOption } from "./enum";
import type { FormContext } from "./context";
import { createMessage, type Config } from "./config";
import type { ValidationError } from "./data-validator";

export interface RequiredAttributes {
  id: string;
  name: string;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  onfocus: (e: Event) => void;
  onblur: (e: Event) => void;
}

export interface WidgetCommonProps<V, A> {
  config: Config;
  value: V | undefined;
  attributes: A & RequiredAttributes;
  errors: ValidationError<unknown>[];
}

export interface SelectWidgetProps<V>
  extends WidgetCommonProps<V, HTMLSelectAttributes> {
  multiple: boolean;
  options: EnumOption<SchemaValue>[];
}

export interface RadioWidgetProps<V>
  extends WidgetCommonProps<V, HTMLInputAttributes> {
  options: EnumOption<SchemaValue>[];
}

export interface FileWidgetProps<V>
  extends WidgetCommonProps<V, HTMLInputAttributes> {
  multiple: boolean;
  loading: boolean;
  processing: boolean;
}

export interface WidgetsAndProps<V> {
  text: WidgetCommonProps<V, HTMLInputAttributes>;
  textarea: WidgetCommonProps<V, HTMLTextareaAttributes>;
  number: WidgetCommonProps<V, HTMLInputAttributes>;
  select: SelectWidgetProps<V>;
  radio: RadioWidgetProps<V>;
  checkbox: WidgetCommonProps<V, HTMLInputAttributes>;
  checkboxes: RadioWidgetProps<V>;
  file: FileWidgetProps<V>;
}

export interface WidgetValue {
  text: string;
  textarea: string;
  number: number | null;
  select: SchemaValue;
  radio: SchemaValue;
  checkbox: boolean;
  checkboxes: SchemaArrayValue;
  file: FileList;
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
  type: T,
  config: Config
) => Widget<CompatibleWidgetType<T>> | undefined;

function getWidgetInternal<T extends WidgetType>(
  ctx: FormContext,
  type: T,
  config: Config
): Widget<CompatibleWidgetType<T>> | undefined {
  const widget = config.uiSchema["ui:widget"];
  switch (typeof widget) {
    case "undefined":
      return ctx.widgets(type, config);
    case "string":
      return ctx.widgets(widget as T, config);
    default:
      return widget as Widget<CompatibleWidgetType<T>>;
  }
}

export function getWidget<T extends WidgetType>(
  ctx: FormContext,
  type: T,
  config: Config
): Widget<CompatibleWidgetType<T>> {
  return (
    getWidgetInternal(ctx, type, config) ??
    (createMessage(
      `Widget "${config.uiSchema["ui:widget"] ?? type}" not found`
    ) as Widget<CompatibleWidgetType<T>>)
  );
}
