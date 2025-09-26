import type { EnumOption } from "@/core/index.js";
import type {
  ComponentProps,
  Config,
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
  errors: string[];
  uiOption: UiOption;
}

export type FoundationalWidgetType = {
  [K in FoundationalComponentType]: ComponentProps[K] extends WidgetCommonProps<any>
    ? WidgetCommonProps<any> extends ComponentProps[K]
      ? K
      : never
    : never;
}[FoundationalComponentType];

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
