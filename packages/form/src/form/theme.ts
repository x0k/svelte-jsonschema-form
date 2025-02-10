import type { Component as SvelteComponent } from "svelte";

import type { Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";

export interface Components {}

export interface ComponentBindings {}

export type ComponentType = keyof Components;

export type Definitions = {
  [T in ComponentType]: SvelteComponent<
    Components[T],
    {},
    //@ts-expect-error
    ComponentBindings[T]
  >;
};

export type ThemeResolver = Resolver<
  ComponentType,
  Config,
  Definitions,
  undefined
>;

export interface FormElements {}

export type FormElement = FormElements[keyof FormElements];

export interface FormElementsProps {}

export type FormElementProps = FormElementsProps[keyof FormElements];

export type CompatibleComponentType<T extends ComponentType> = {
  [C in ComponentType]: Components[C] extends Components[T]
    ? ComponentBindings[C] extends ComponentBindings[T]
      ? C
      : never
    : never;
};
