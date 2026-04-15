import type { Ref } from "@/lib/svelte.svelte.js";
import type {
  ComponentProps,
  ComponentType,
  Config,
  FieldErrors,
  FormEnumOption,
  FoundationalComponentType,
  SchemaValue,
  UiOption,
} from "@/form/index.js";
import type { EnumValueMapper } from "@/options.svelte.js";

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
  options: FormEnumOption[];
  // TODO: Make required in v4
  mapper?: EnumValueMapper;
}

export interface SingleSelectOptions extends Options {
  /** @deprecated use `clearable` instead */
  hasInitialValue?: boolean;
  // TODO: Make required in v4
  clearable?: boolean;
  // TODO: Make required in v4
  mapped?: Ref<string>;
}

export interface MultiSelectOptions extends Options {
  // TODO: Make required in v4
  mapped?: Ref<string[]>;
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
    selectWidget: WidgetCommonProps<SchemaValue> & SingleSelectOptions;
    checkboxWidget: WidgetCommonProps<boolean>;
  }
  interface ComponentBindings {
    textWidget: "value";
    numberWidget: "value";
    selectWidget: "value";
    checkboxWidget: "value";
  }
}
