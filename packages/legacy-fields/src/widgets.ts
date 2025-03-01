import type { EnumOption, SchemaArrayValue } from "@sjsf/form/core";
import type { Config, FieldErrors, SchemaValue } from "@sjsf/form";

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

declare module "@sjsf/form" {
  interface FoundationalComponents {
    textWidget: {};
    numberWidget: {};
    selectWidget: {};
    checkboxWidget: {};
    checkboxesWidget: {};
    fileWidget: {};
  }

  interface ComponentProps {
    textWidget: WidgetCommonProps<string>;
    numberWidget: WidgetCommonProps<number>;
    selectWidget: WidgetCommonProps<SchemaValue> & Options;
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
    checkboxWidget: "value";
    checkboxesWidget: "value";
    fileWidget: "value";
  }
}
