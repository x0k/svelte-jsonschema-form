import type { EnumOption } from "@/core/index.js";
import type {
  ComponentProps,
  ComponentType,
  Config,
  FieldErrors,
  FoundationalComponentType,
  SchemaValue,
  UiOption,
} from "@/form/index.js";

export interface Handlers {
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

export interface WidgetCommonProps<V> {
  type: "widget";
  config: Config;
  value: V | undefined;
  handlers: Handlers;
  errors: FieldErrors;
  uiOption: UiOption;
}

export type WidgetType = keyof {
  [T in ComponentType as ComponentProps[T] extends WidgetCommonProps<any>
    ? T
    : never]: T;
};

export type FoundationalWidgetType = keyof {
  [T in WidgetType &
    FoundationalComponentType as WidgetCommonProps<any> extends ComponentProps[T]
    ? T
    : never]: T;
};

export interface Options {
  options: EnumOption<SchemaValue>[];
}

declare module "../form/index.js" {
  interface FoundationalComponents {
    textWidget: {};
    numberWidget: {};
    selectWidget: {};
    checkboxWidget: {};
  }

  interface ComponentProps {
    textWidget: WidgetCommonProps<string>;
    numberWidget: WidgetCommonProps<number>;
    selectWidget: WidgetCommonProps<SchemaValue> & Options;
    checkboxWidget: WidgetCommonProps<boolean>;
  }
  interface ComponentBindings {
    textWidget: "value";
    numberWidget: "value";
    selectWidget: "value";
    checkboxWidget: "value";
  }
}
