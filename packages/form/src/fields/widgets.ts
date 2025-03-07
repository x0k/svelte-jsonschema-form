import type { EnumOption, SchemaArrayValue } from "@/core/index.js";
import type { Config, FieldError, SchemaValue } from "@/form/index.js";

export interface Handlers {
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

export interface WidgetCommonProps<V> {
  config: Config;
  value: V | undefined;
  handlers: Handlers;
  errors: FieldError<unknown>[];
}

export interface Options {
  options: EnumOption<SchemaValue>[];
}

declare module "../form/index.js" {
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
