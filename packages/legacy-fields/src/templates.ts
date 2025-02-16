import type { Snippet } from "svelte";

import type {
  SchemaValue,
  SchemaObjectValue,
  SchemaArrayValue,
} from "@sjsf/form/core";
import type { Config, FieldErrors } from "@sjsf/form";

export interface TemplateCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config;
  errors: FieldErrors<unknown>;
  children: Snippet;
}

declare module "@sjsf/form" {
  interface ComponentProps {
    fieldTemplate: TemplateCommonProps<SchemaValue> & {
      showTitle: boolean;
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
