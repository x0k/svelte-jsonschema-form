import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Component, ComponentType } from "./component";
import type { Field, FieldType } from "./fields";
import type { Template, TemplateType } from "./templates";
import type { Widget, WidgetType } from "./widgets";

export type UiSchemaRoot = UiSchemaRootIndex & UiSchemaRootContent;

interface UiSchemaRootIndex {
  [key: string]: UiSchemaRootContent[keyof UiSchemaRootContent];
}

type UiSchemaRootContent = UiSchemaContent & {
  "ui:rootFieldId"?: string;
  "ui:globalOptions"?: UiOptions;
  submitButton?: UiSchema;
};

interface UiSchemaContent {
  "ui:options"?: UiOptions;
  "ui:widget"?: WidgetType | Widget<WidgetType>;
  "ui:field"?: FieldType | Field<FieldType>;
  "ui:templates"?: Partial<{
    [T in TemplateType]: TemplateType | Template<T>;
  }>;
  "ui:components"?: Partial<{
    [T in ComponentType]: ComponentType | Component<T>;
  }>;
  items?: UiSchema | UiSchema[];
  anyOf?: UiSchema[];
  oneOf?: UiSchema[];
  additionalProperties?: UiSchema;
  additionalPropertyKeyInput?: UiSchema;
  additionalItems?: UiSchema;
}

// TODO: Omit non serializable properties
export type InputAttributes = (
  | HTMLInputAttributes
  | HTMLTextareaAttributes
  | HTMLSelectAttributes
  | HTMLButtonAttributes
) & {
  // To reduce amount of type casting
  readonly?: boolean;
};

export interface UiOptions {
  input?: InputAttributes;
  content?: HTMLAttributes<HTMLDivElement>
  container?: HTMLAttributes<HTMLDivElement>
  // TODO: Clarify the need for this
  // root?: HTMLAttributes<HTMLDivElement>
  title?: string;
  description?: string;
  enumNames?: string[];
  order?: string[];
  addable?: boolean;
  expandable?: boolean;
  orderable?: boolean;
  removable?: boolean;
  copyable?: boolean;
  duplicateKeySuffixSeparator?: string;
  help?: string;
  hideTitle?: boolean;
}

export type UiSchema = UiSchemaIndex & UiSchemaContent;

interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}
