import type { Snippet, Component as SvelteComponent } from "svelte";
import type { HTMLAttributes, HTMLButtonAttributes } from "svelte/elements";

import { fromRecord, type Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";
import type { ValidationError } from "./validator.js";

export interface FormElements {}

export type FormElement = FormElements[keyof FormElements];

export interface FormComponentProps {
  ref?: FormElement | undefined;
  children: Snippet;
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
  children: Snippet;
  onclick?: (e: Event) => void;
  attributes?: HTMLButtonAttributes | undefined;
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

export interface LayoutComponentProps {
  type: keyof LayoutType;
  children: Snippet;
  attributes?: HTMLAttributes<HTMLDivElement> | undefined;
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

export interface ErrorsListProps {
  forId: string;
  errors: ValidationError<unknown>[];
}

export interface ComponentsAndProps {
  form: FormComponentProps;
  button: ButtonComponentProps;
  layout: LayoutComponentProps;
  title: TitleComponentProps;
  description: DescriptionComponentProps;
  help: HelpComponentProps;
  errorsList: ErrorsListProps;
}

export interface ComponentBindings {
  form: "ref";
  button: "";
  layout: "";
  title: "";
  description: "";
  help: "";
  errorsList: "";
}

export type ComponentType = keyof ComponentsAndProps;

export type ComponentProps<T extends ComponentType> = ComponentsAndProps[T] & {
  config: Config;
  errors: ValidationError<unknown>[];
};

export type Component<T extends ComponentType> = SvelteComponent<
  ComponentProps<T>,
  {},
  // @ts-expect-error something with typescript
  ComponentBindings[T]
>;

export type Components = { [T in ComponentType]: Component<T> };

export type ComponentsResolver = Resolver<
  ComponentType,
  Config,
  Components,
  undefined
>;

export const createComponents = fromRecord as (
  r: Partial<Components>
) => ComponentsResolver;
