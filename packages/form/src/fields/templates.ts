import type { Snippet } from "svelte";

import type {
  SchemaValue,
  SchemaObjectValue,
  SchemaArrayValue,
} from "@/core/index.js";
import type {
  Config,
  FieldError,
  FoundationalComponent,
} from "@/form/index.js";

export interface TemplateCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config;
  errors: FieldError<unknown>[];
  children: Snippet;
}

declare module "../form/index.js" {
  interface FoundationalComponents {
    fieldTemplate: {};
    objectTemplate: {};
    objectPropertyTemplate: {};
    arrayTemplate: {};
    arrayItemTemplate: {};
    multiFieldTemplate: {};
  }
  interface ComponentProps {
    fieldTemplate: TemplateCommonProps<SchemaValue> & {
      showTitle: boolean;
      widgetType: FoundationalComponent;
    };
    objectTemplate: TemplateCommonProps<SchemaObjectValue> & {
      addButton?: Snippet;
    };
    objectPropertyTemplate: TemplateCommonProps<SchemaValue> & {
      property: string;
      keyInput?: Snippet;
      removeButton?: Snippet;
    };
    arrayTemplate: TemplateCommonProps<SchemaArrayValue> & {
      addButton?: Snippet;
    };
    arrayItemTemplate: TemplateCommonProps<SchemaValue> & {
      index: number;
      buttons?: Snippet;
    };
    multiFieldTemplate: TemplateCommonProps<SchemaValue> & {
      optionSelector: Snippet;
    };
  }

  interface ComponentBindings {
    fieldTemplate: "";
    objectTemplate: "";
    objectPropertyTemplate: "";
    arrayTemplate: "";
    arrayItemTemplate: "";
    multiFieldTemplate: "";
  }
}
