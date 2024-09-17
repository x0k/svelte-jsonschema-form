import type { Component as SvelteComponent, Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { PropOrDefault } from "@/lib/types";

import type { Schema, SchemaType } from "./schema/schema";

export interface FormComponentProps extends HTMLAttributes<HTMLFormElement> {
  children: Snippet;
}

export interface FormComponentExports {
  submitRequest: (submitter?: HTMLElement | null) => void;
  reset: () => void;
}

export type ComponentType = SchemaType | "form";

export interface ComponentProps {
  form: FormComponentProps;
}

export interface ComponentExports {
  form: FormComponentExports;
}

export interface ComponentBindings {}

export interface ComponentOptions<T extends ComponentType> {
  type: T;
  schema: Schema;
}

export type Component<T extends ComponentType> = SvelteComponent<
  PropOrDefault<ComponentProps, T, {}>,
  PropOrDefault<ComponentExports, T, {}>,
  PropOrDefault<ComponentBindings, T, "">
>;
