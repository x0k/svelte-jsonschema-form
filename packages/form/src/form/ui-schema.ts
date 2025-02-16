import type {
  CompatibleComponentType,
  ComponentType,
  Definitions,
} from "./theme.js";

export type UiSchemaRoot = UiSchemaRootIndex & UiSchemaRootContent;

export interface UiSchemaRootIndex {
  [key: string]: UiSchemaRootContent[keyof UiSchemaRootContent];
}

export interface UiSchemaRootContent extends UiSchemaContent {
  "ui:globalOptions"?: UiOptions;
}

export interface UiSchemaContent {
  "ui:options"?: UiOptions;
  "ui:components"?: Partial<{
    [T in ComponentType]: CompatibleComponentType<T> | Definitions[T];
  }>;
  items?: UiSchema | UiSchema[];
  anyOf?: UiSchema[];
  oneOf?: UiSchema[];
  additionalProperties?: UiSchema;
  additionalPropertyKeyInput?: UiSchema;
  additionalItems?: UiSchema;
}

export interface UiOptions {}

export type UiSchema = UiSchemaIndex & UiSchemaContent;

export interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}
