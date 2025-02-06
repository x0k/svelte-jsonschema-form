import type { Component as SvelteComponent } from "svelte";

import { fromRecord, type Resolver } from "@/lib/resolver.js";
import type {
  SchemaArrayValue,
  SchemaValue,
  EnumOption,
} from "@/core/index.js";

import type { Config } from "./config.js";
import type { FieldErrors } from "./errors.js";

export interface Handlers {
  onblur?: (e: Event) => void;
  oninput?: (e: Event) => void;
  onchange?: (e: Event) => void;
}

export interface WidgetCommonProps<V> {
  config: Config;
  value: V | undefined;
  handlers: Handlers;
  errors: FieldErrors;
}

export interface SelectWidgetProps<V> extends WidgetCommonProps<V> {
  options: EnumOption<SchemaValue>[];
}

export interface RadioWidgetProps<V> extends WidgetCommonProps<V> {
  options: EnumOption<SchemaValue>[];
}

export interface FileWidgetProps<V> extends WidgetCommonProps<V> {
  multiple: boolean;
  loading: boolean;
  processing: boolean;
}

export interface WidgetsAndProps<V> {
  text: WidgetCommonProps<V>;
  textarea: WidgetCommonProps<V>;
  number: WidgetCommonProps<V>;
  select: SelectWidgetProps<V>;
  multiSelect: SelectWidgetProps<V>;
  radio: RadioWidgetProps<V>;
  checkbox: WidgetCommonProps<V>;
  checkboxes: RadioWidgetProps<V>;
  file: FileWidgetProps<V>;
}

export interface WidgetValue {
  text: string;
  textarea: string;
  number: number | null;
  select: SchemaValue;
  multiSelect: SchemaArrayValue;
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

export type Widgets = {
  [T in WidgetType]: Widget<T>;
};

export type CompatibleWidgetType<T extends WidgetType> = {
  [W in WidgetType]: WidgetValue[T] extends WidgetValue[W] ? W : never;
}[WidgetType];

export type CompatibleWidgets = {
  [T in WidgetType]: {
    [K in CompatibleWidgetType<T>]: Widget<K>;
  }[CompatibleWidgetType<T>];
};

export type WidgetsResolver = Resolver<
  WidgetType,
  Config,
  CompatibleWidgets,
  undefined
>;

export const createWidgets = fromRecord as (
  r: Partial<Widgets>
) => WidgetsResolver;
