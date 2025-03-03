import type {
  CompatibleComponentType,
  ComponentDefinitions,
  FoundationalComponent,
} from "./components.js";

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
    [T in FoundationalComponent]:
      | Exclude<CompatibleComponentType<T>, T>
      | ComponentDefinitions[T];
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
