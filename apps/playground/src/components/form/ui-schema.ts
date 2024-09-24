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
  items?: UiSchema | UiSchema[];
  anyOf?: UiSchema[];
  oneOf?: UiSchema[];
  additionalProperties?: UiSchema;
}

export interface UiOptions {
  class?: string;
  style?: string;
  widget?: WidgetType | Widget<any>;
  title?: string;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  enumNames?: string[];
  order?: string[]
  expandable?: boolean
}

export type UiSchema = UiSchemaIndex & UiSchemaContent;

interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}

type UiSchemaContent = UiSchemaCommonContent<UiOptions>;
