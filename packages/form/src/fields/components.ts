import type { Snippet } from "svelte";

import type { Config, FieldErrors } from "@/form/index.js";

export interface ComponentCommonProps {
  config: Config;
  errors: FieldErrors;
}

export interface ButtonTypes {
  "object-property-add": {};
  "object-property-remove": {};
  "array-item-add": {};
  "array-item-move-down": {};
  "array-item-move-up": {};
  "array-item-copy": {};
  "array-item-remove": {};
}

export type ButtonType = keyof ButtonTypes;

export interface LayoutTypes {
  field: {};
  "field-meta": {};
  "field-content": {};
  "object-field": {};
  "object-field-meta": {};
  "object-properties": {};
  "object-property": {};
  "object-property-key-input": {};
  "object-property-content": {};
  "object-property-controls": {};
  "array-field": {};
  "array-field-meta": {};
  "array-items": {};
  "array-item": {};
  "array-item-content": {};
  "array-item-controls": {};
  "multi-field": {};
  "multi-field-content": {};
  "multi-field-controls": {};
}

export type LayoutType = keyof LayoutTypes;

declare module "../form/index.js" {
  interface FoundationalComponents {
    button: {};
    layout: {};
  }
  interface ComponentProps {
    button: ComponentCommonProps & {
      type: ButtonType;
      disabled: boolean;
      children: Snippet;
      onclick: () => void;
    };
    layout: ComponentCommonProps & {
      type: LayoutType;
      children: Snippet;
    };
  }
  interface ComponentBindings {
    button: "";
    layout: "";
  }
}
