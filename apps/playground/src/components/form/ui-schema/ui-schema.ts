import type { Component } from "../component";

export interface CommonUiOptions {
  class?: string;
  style?: string;
  component?: Component<any>;
  title?: string;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
  enumNames?: string[];
}

export interface FormComponentUiOptions {
  submitButton?: CommonUiOptions;
}

export type UiOptions = CommonUiOptions & FormComponentUiOptions;

export type UiSchema = UiSchemaRoot & UiSchemaParts

interface UiSchemaRoot {
  [key: string]: UiSchemaParts[keyof UiSchemaParts];
}

type UiSchemaParts = UiSchemaCommon & ArrayUiSchema;

interface UiSchemaCommon {
  "ui:options"?: UiOptions;
}

interface ArrayUiSchema {
  items?: UiSchema | UiSchema[];
}
