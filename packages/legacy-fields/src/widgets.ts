import type { EnumOption, SchemaArrayValue } from "@sjsf/form/core";
import {
  type Definitions,
  type Config,
  type FieldErrors,
  type SchemaValue,
} from "@sjsf/form";

export interface Handlers {
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

export interface WidgetCommonProps<V> {
  config: Config;
  value: V | undefined;
  handlers: Handlers;
  errors: FieldErrors<unknown>;
}

export interface Options {
  options: EnumOption<SchemaValue>[];
}

interface RequiredWidgets {
  textWidget: {};
  numberWidget: {};
  selectWidget: {};
  radioWidget: {};
  checkboxWidget: {};
  checkboxesWidget: {};
  fileWidget: {};
}

type RequiredWidget = keyof RequiredWidgets;

type OmitOptionalWidgets<D extends Record<any, any>> = {
  [K in keyof D as K extends `${infer _}Widget`
    ? K extends RequiredWidget
      ? K
      : never
    : K]: D[K];
};

type MakeNonRequiredWidgetsOptional<D extends Record<any, any>> = {
  [K in keyof D as K extends `${infer _}Widget`
    ? K extends RequiredWidget
      ? never
      : K
    : never]?: D[K];
};

export type Defs = OmitOptionalWidgets<Definitions> &
  MakeNonRequiredWidgetsOptional<Definitions>;

declare module "@sjsf/form" {
  interface ComponentProps {
    textWidget: WidgetCommonProps<string>;
    numberWidget: WidgetCommonProps<number>;
    selectWidget: WidgetCommonProps<SchemaValue> & Options;
    radioWidget: WidgetCommonProps<SchemaValue> & Options;
    checkboxWidget: WidgetCommonProps<boolean>;
    checkboxesWidget: WidgetCommonProps<SchemaArrayValue> & Options;
    fileWidget: WidgetCommonProps<FileList> & {
      multiple: boolean;
      loading: boolean;
      processing: boolean;
    };
  }
  interface ComponentBindings {
    textWidget: "value";
    numberWidget: "value";
    selectWidget: "value";
    radioWidget: "value";
    checkboxWidget: "value";
    checkboxesWidget: "value";
    fileWidget: "value";
  }
}
