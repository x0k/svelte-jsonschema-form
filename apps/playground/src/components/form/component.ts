import type { Snippet, Component as SvelteComponent } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { Get } from "@/lib/types";

export interface FormComponentProps extends HTMLAttributes<HTMLFormElement> {
  form: HTMLFormElement | undefined;
}

export interface LayoutType {
  "root-field": {};
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

export interface ComponentsAndProps {
  form: FormComponentProps;
  button: HTMLAttributes<HTMLButtonElement>;
  layout: LayoutComponentProps;
  alert: AlertComponentProps;
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

export type Components = <T extends ComponentType>(type: T) => Component<T>;
