import type { Component as SvelteComponent } from "svelte";

import type { Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";
import type { ValidationError } from "./validator.js";

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

export interface ComponentCommonProps {
  config: Config;
  errors: ValidationError<unknown>[];
}

export interface FormElements {}

export type FormElement = FormElements[keyof FormElements];

export interface FormElementsProps {}

export type FormElementProps = FormElementsProps[FormElement];

export type CompatibleComponentType<T extends ComponentType> = {
  [C in ComponentType]: Components[C] extends Components[T]
    ? ComponentBindings[C] extends ComponentBindings[T]
      ? C
      : never
    : never;
};
