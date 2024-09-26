import type { Component as SvelteComponent } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { Get } from "@/lib/types";

import type { UiSchema } from './ui-schema';

export interface FormComponentProps extends HTMLAttributes<HTMLFormElement> {
  form: HTMLFormElement | undefined;
}

export interface ButtonType {
  submit: {};
  "add-object-property": {};
  "remove-object-property": {};
  "add-array-item": {};
  "move-down-array-item": {};
  "move-up-array-item": {};
  "copy-array-item": {};
  "remove-array-item": {};
}

export interface ButtonComponentProps extends HTMLAttributes<HTMLButtonElement> {
  type: keyof ButtonType;
  disabled: boolean;
}

export interface LayoutType {
  "root-field": {};
  "object-field": {};
  "object-properties": {};
  "array-field": {};
  "array-items": {};
  "array-item": {};
  "array-item-content": {}
  "array-item-buttons": {}
}

export interface LayoutComponentProps extends HTMLAttributes<HTMLDivElement> {
  type: keyof LayoutType;
}

export interface AlertType {
  error: {};
}

export interface AlertComponentProps
  extends HTMLAttributes<HTMLDivElement> {
  type: keyof AlertType;
  title?: string;
}

export interface TemplateType {
  "object": {};
  "array": {};
}

export interface TitleComponentProps extends HTMLAttributes<HTMLElement> {
  type: keyof TemplateType;
  title: string;
}

export interface DescriptionComponentProps extends HTMLAttributes<HTMLElement> {
  type: keyof TemplateType;
  description: string;
}

export interface ComponentsAndProps {
  form: FormComponentProps;
  button: ButtonComponentProps;
  layout: LayoutComponentProps;
  alert: AlertComponentProps;
  title: TitleComponentProps;
  description: DescriptionComponentProps;
}

export interface ComponentExports {}

export interface ComponentBindings {
  form: "form";
}

export type ComponentType = keyof ComponentsAndProps;

export type ComponentProps<T extends ComponentType> = ComponentsAndProps[T];

export type Component<T extends ComponentType> = SvelteComponent<
  ComponentProps<T>,
  Get<ComponentExports, T, {}>,
  Get<ComponentBindings, T, "">
>;

export type Components = <T extends ComponentType>(type: T, uiSchema: UiSchema) => Component<T> | undefined;
