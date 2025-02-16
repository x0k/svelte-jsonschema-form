import type { EnumOption, SchemaArrayValue } from "@sjsf/form/core";
import { type Config, type FieldErrors, type SchemaValue } from "@sjsf/form";

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
  errors: FieldErrors<unknown>;
}

export interface Options {
  options: EnumOption<SchemaValue>[];
}

declare module "@sjsf/form" {
  interface ComponentProps {
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
