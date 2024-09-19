import type { Component as SvelteComponent } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { PropOrDefault } from "@/lib/types";

import type { Schema, SchemaType } from "./schema";
import type { UiSchema } from "./ui-schema";

export type ComponentType = SchemaType | "form" | "button" | "layout";

export interface FormComponentProps extends HTMLAttributes<HTMLFormElement> {
  form: HTMLFormElement | undefined;
}

export interface ComponentProps {
  form: FormComponentProps;
  button: HTMLAttributes<HTMLButtonElement>;
  layout: HTMLAttributes<HTMLDivElement>;
}

export interface ComponentExports {}

export interface ComponentBindings {
  form: "form";
}

export type Component<T extends ComponentType> = SvelteComponent<
  PropOrDefault<ComponentProps, T, {}>,
  PropOrDefault<ComponentExports, T, {}>,
  PropOrDefault<ComponentBindings, T, "">
>;

export interface ComponentOptions {
  schema: Schema;
  uiSchema: UiSchema;
}

export type Components = <T extends ComponentType>(
  type: T,
  options: ComponentOptions
) => Component<T>;
