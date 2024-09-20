import type { Component, ComponentType } from "./component";
import type { Field, FieldType } from "./fields";
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
};

interface UiSchemaCommonContent<O> extends ArrayUiSchema {
  "ui:options"?: O;
}

interface ArrayUiSchema {
  items?: UiSchema | UiSchema[];
}

export interface UiOptions {
  class?: string;
  style?: string;
  field?: FieldType | Field<any>;
  component?: ComponentType | Component<any>;
  widget?: WidgetType | Widget<any>;
  title?: string;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
  enumNames?: string[];
}

export type UiSchema = UiSchemaIndex & UiSchemaContent;

interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}

type UiSchemaContent = UiSchemaCommonContent<UiOptions>;
