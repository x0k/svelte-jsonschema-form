import type { Snippet } from "svelte";

import type { ComponentCommonProps, ValidationError } from "@/form/index.js";

export interface ButtonType {
  "object-property-add": {};
  "object-property-remove": {};
  "array-item-add": {};
  "array-item-move-down": {};
  "array-item-move-up": {};
  "array-item-copy": {};
  "array-item-remove": {};
}

export interface LayoutType {
  "root-field": {};
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

export interface ParentTemplateType {
  field: {};
  object: {};
  array: {};
}

declare module "@/form/index.js" {
  interface Components {
    button: ComponentCommonProps & {
      type: keyof ButtonType;
      children: Snippet;
      onclick: () => void;
    };
    layout: ComponentCommonProps & {
      type: keyof LayoutType;
      children: Snippet;
    };
    title: ComponentCommonProps & {
      type: keyof ParentTemplateType;
      title: string;
      forId: string;
      required: boolean;
    };
    description: ComponentCommonProps & {
      type: keyof ParentTemplateType;
      description: string;
    };
    help: ComponentCommonProps & {
      help: string;
    };
    errorsList: ComponentCommonProps & {
      forId: string;
      errors: ValidationError<unknown>[];
    };
  }
  interface ComponentBindings {
    button: "";
    layout: "";
    title: "";
    description: "";
    help: "";
    errorsList: "";
  }
}
