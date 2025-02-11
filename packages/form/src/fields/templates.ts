import type { Snippet } from "svelte";

import type {
  SchemaValue,
  SchemaObjectValue,
  SchemaArrayValue,
} from "@/core/schema.js";
import type {
  Components,
  ComponentType,
  Config,
  FieldErrors,
} from "@/form/index.js";

export interface TemplateCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config;
  errors: FieldErrors;
  children: Snippet;
}

declare module "@/form/index.js" {
  interface Components {
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

export type TemplateType = {
  [T in ComponentType]: T extends `${infer K}Template` ? K : never;
}[ComponentType];

export type TemplateProps<T extends TemplateType> = Components[`${T}Template`]
