import type { Snippet } from "svelte";

import type { Config, ValidationError } from "@/form/index.js";

export interface ComponentCommonProps {
  config: Config;
  errors: ValidationError<unknown>[];
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

export type LayoutType = keyof LayoutTypes;

export interface ParentTemplateTypes {
  field: {};
  object: {};
  array: {};
}

export type ParentTemplateType = keyof ParentTemplateTypes;

declare module "@/form/index.js" {
  interface Components {
    button: ComponentCommonProps & {
      type: ButtonType;
      children: Snippet;
      onclick: () => void;
    };
    layout: ComponentCommonProps & {
      type: LayoutType;
      children: Snippet;
    };
    title: ComponentCommonProps & {
      type: ParentTemplateType;
      title: string;
      forId: string;
      required: boolean;
    };
    description: ComponentCommonProps & {
      type: ParentTemplateType;
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
