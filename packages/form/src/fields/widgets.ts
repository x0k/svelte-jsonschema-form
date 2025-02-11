import type { EnumOption, SchemaArrayValue } from "@/core/index.js";
import {
  getComponent,
  type Components,
  type ComponentType,
  type Config,
  type Definitions,
  type FieldErrors,
  type FormContext,
  type SchemaValue,
} from "@/form/index.js";

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

export interface Handlers {
  onblur?: (e: Event) => void;
  oninput?: (e: Event) => void;
  onchange?: (e: Event) => void;
}

export interface WidgetCommonProps<N extends keyof WidgetValue> {
  config: Config;
  value: WidgetValue[N] | undefined;
  handlers: Handlers;
  errors: FieldErrors;
}

export interface Options {
  options: EnumOption<SchemaValue>[];
}

declare module "@/form/index.js" {
  interface Components {
    textWidget: WidgetCommonProps<"text">;
    textareaWidget: WidgetCommonProps<"textarea">;
    numberWidget: WidgetCommonProps<"number">;
    selectWidget: WidgetCommonProps<"select"> & Options;
    multiSelectWidget: WidgetCommonProps<"multiSelect"> & Options;
    radioWidget: WidgetCommonProps<"radio"> & Options;
    checkboxWidget: WidgetCommonProps<"checkbox">;
    checkboxesWidget: WidgetCommonProps<"checkboxes"> & Options;
    fileWidget: WidgetCommonProps<"file"> & {
      multiple: boolean;
      loading: boolean;
      processing: boolean;
    };
  }
  interface ComponentBindings {
    textWidget: "value";
    textareaWidget: "value";
    numberWidget: "value";
    selectWidget: "value";
    multiSelectWidget: "value";
    radioWidget: "value";
    checkboxWidget: "value";
    checkboxesWidget: "value";
    fileWidget: "value";
  }
}

export type WidgetType = {
  [T in ComponentType]: T extends `${infer K}Widget` ? K : never;
}[ComponentType];

export type WidgetProps<T extends WidgetType> = Components[`${T}Widget`];

export type CompatibleWidgetType<T extends WidgetType> = {
  [W in WidgetType]: WidgetValue[T] extends WidgetValue[W] ? W : never;
}[WidgetType];

export type CompatibleWidgets = {
  [T in WidgetType]: {
    [K in CompatibleWidgetType<T>]: Definitions[`${K}Widget`];
  }[CompatibleWidgetType<T>];
};

export const getWidget = getComponent as <T extends WidgetType>(
  ctx: FormContext,
  type: `${T}Widget`,
  config: Config
) => CompatibleWidgets[T] | undefined;
