import type { PropOrDefault } from "@/lib/types";

import type { Component, ComponentType } from "../component";

export interface CommonUiOptions {
  title?: string;
  description?: string;
}

interface ComponentUiOptions {}

export type UiOptions<T extends ComponentType> = CommonUiOptions &
  PropOrDefault<ComponentUiOptions, T, {}> & {
    "ui:component"?: Component<T>;
  };

export type UiSchema = UiSchemaRoot & UiSchemaCommon & ArrayUiSchema;

interface UiSchemaRoot {
  [key: string]: UiSchema;
}

interface UiSchemaCommon {
  "ui:options"?: UiOptions<ComponentType>;
}

interface ArrayUiSchema {
  items?: UiSchema | UiSchema[];
}
