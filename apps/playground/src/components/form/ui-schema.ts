import type { Component, ComponentType } from "./component";
import type { Field, FieldType } from "./fields";
import type { Template, TemplateType } from "./templates";
import type { Widget, WidgetType } from "./widgets";

export type UiSchemaRoot = UiSchemaRootIndex & UiSchemaRootContent;

interface UiSchemaRootIndex {
  [key: string]: UiSchemaRootContent[keyof UiSchemaRootContent];
}

type UiSchemaRootContent = UiSchemaCommonContent<
  UiOptions & {
    submitButton?: UiOptions;
  }
> & {
  "ui:rootFieldId"?: string;
  "ui:globalOptions"?: UiOptions;
};

interface UiSchemaCommonContent<O> {
  "ui:options"?: O;
  "ui:widget"?: WidgetType | Widget<WidgetType>;
  "ui:field"?: FieldType | Field<FieldType>;
  "ui:templates"?: {
    [T in TemplateType]: undefined | TemplateType | Template<T>;
  };
  "ui:components"?: {
    [T in ComponentType]: undefined | ComponentType | Component<T>;
  };
  items?: UiSchema | UiSchema[];
  anyOf?: UiSchema[];
  oneOf?: UiSchema[];
  additionalProperties?: UiSchema;
}

export interface UiOptions {
  class?: string;
  style?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  enumNames?: string[];
  order?: string[];
  addable?: boolean;
  expandable?: boolean;
  orderable?: boolean;
  removable?: boolean;
  copyable?: boolean;
}

export type UiSchema = UiSchemaIndex & UiSchemaContent;

interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}

type UiSchemaContent = UiSchemaCommonContent<UiOptions>;
