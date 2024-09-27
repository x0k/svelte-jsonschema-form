import type { Snippet, Component as SvelteComponent } from "svelte";

import type { Get } from "@/lib/types";

import type { UiSchema } from "./ui-schema";
import type { HTMLButtonAttributes } from "svelte/elements";

export interface FormComponentProps {
  form: HTMLFormElement | undefined;
}

export interface ButtonType {
  submit: {};
  "object-property-add": {};
  "object-property-remove": {};
  "array-item-add": {};
  "array-item-move-down": {};
  "array-item-move-up": {};
  "array-item-copy": {};
  "array-item-remove": {};
}

export interface ButtonComponentProps {
  type: keyof ButtonType;
  disabled: boolean;
  onclick?: (e: Event) => void;
  // For submit button
  attributes?: HTMLButtonAttributes | undefined;
  children?: Snippet;
}

export interface LayoutType {
  "root-field": {};
  field: {};
  "field-content": {};
  "object-field": {};
  "object-properties": {};
  "object-property": {};
  "object-property-key-input": {};
  "object-property-content": {};
  "object-property-controls": {};
  "array-field": {};
  "array-items": {};
  "array-item": {};
  "array-item-content": {};
  "array-item-controls": {};
}

export interface LayoutComponentProps {
  type: keyof LayoutType;
}

export interface AlertType {
  error: {};
}

export interface AlertComponentProps {
  type: keyof AlertType;
  title?: string;
}

export interface ParentTemplateType {
  field: {};
  object: {};
  array: {};
}

export interface TitleComponentProps {
  type: keyof ParentTemplateType;
  title: string;
  forId: string;
  required: boolean;
}

export interface DescriptionComponentProps {
  type: keyof ParentTemplateType;
  description: string;
}

export interface HelpComponentProps {
  help: string;
}

export interface ComponentsAndProps {
  form: FormComponentProps;
  button: ButtonComponentProps;
  layout: LayoutComponentProps;
  alert: AlertComponentProps;
  title: TitleComponentProps;
  description: DescriptionComponentProps;
  help: HelpComponentProps;
}

export interface ComponentBindings {
  form: "form";
}

export type ComponentType = keyof ComponentsAndProps;

export type ComponentProps<T extends ComponentType> = ComponentsAndProps[T];

export type Component<T extends ComponentType> = SvelteComponent<
  ComponentProps<T>,
  {},
  Get<ComponentBindings, T, "">
>;

export type Components = <T extends ComponentType>(
  type: T,
  uiSchema: UiSchema
) => Component<T> | undefined;
