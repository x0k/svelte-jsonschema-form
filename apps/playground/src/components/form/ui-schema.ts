import type { Component, ComponentType } from "./component";
import type { Field, FieldType } from './fields';

export type UiSchemaRoot = UiSchemaRootIndex & UiSchemaRootContent;

interface UiSchemaRootIndex {
  [key: string]: UiSchemaRootContent[keyof UiSchemaRootContent];
}

type UiSchemaRootContent = UiSchemaCommonContent<
  UiOptions & {
    submitButton?: UiOptions;
  }
>;

interface UiSchemaCommonContent<O> extends ArrayUiSchema {
  "ui:options"?: O;
}

interface ArrayUiSchema {
  items?: UiSchema | UiSchema[];
}

export interface UiOptions {
  class?: string;
  style?: string;
  field?: FieldType | Field<any, any>
  component?: ComponentType | Component<any>;
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
