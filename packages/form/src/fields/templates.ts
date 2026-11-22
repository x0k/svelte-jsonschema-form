import type { Snippet } from "svelte";

import type { SchemaValue } from "#core/index.js";
import type {
  ComponentProps,
  ComponentType,
  Config,
  FieldErrors,
  FoundationalComponentType,
  UiOption,
} from "#form/index.js";

export interface TemplateCommonProps<V extends SchemaValue> {
  type: "template";
  value: V | null | undefined;
  config: Config;
  uiOption: UiOption;
  errors: FieldErrors;
  children: Snippet;
}

export type TemplateType = keyof {
  [
    T in ComponentType as ComponentProps[T] extends TemplateCommonProps<any>
      ? T
      : never
  ]: T;
};

declare module "../form/index.js" {
  interface FoundationalComponents {
    fieldTemplate: {};
  }
  interface ComponentProps {
    fieldTemplate: TemplateCommonProps<SchemaValue> & {
      showTitle: boolean;
      useLabel: boolean;
      widgetType: FoundationalComponentType;
      action?: Snippet;
      /**
       * Fallback description used when `ui:options.description` is not set.
       * Takes precedence over the schema description.
       */
      description?: string;
    };
  }

  interface ComponentBindings {
    fieldTemplate: "";
  }
}
