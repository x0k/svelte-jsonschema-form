import type { Component as SvelteComponent, Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { PropOrDefault } from "@/lib/types";

import type { Schema, SchemaType } from "./schema";
import type { UiSchema } from './ui-schema';

export type ComponentType = SchemaType | "form" | "button"

export interface FormComponentProps extends HTMLAttributes<HTMLFormElement> {
  form: HTMLFormElement | undefined;
  children: Snippet;
}

export interface ComponentProps {
  form: FormComponentProps;
  button: HTMLAttributes<HTMLButtonElement>;
}

export interface ComponentExports {}

export interface ComponentBindings {
  form: "form";
}

export interface ComponentOptions {
  schema: Schema;
  uiSchema: UiSchema
}

export type Component<T extends ComponentType> = SvelteComponent<
  PropOrDefault<ComponentProps, T, {}>,
  PropOrDefault<ComponentExports, T, {}>,
  PropOrDefault<ComponentBindings, T, "">
>;
