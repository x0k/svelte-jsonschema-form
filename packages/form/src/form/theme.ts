import type { Component as SvelteComponent } from "svelte";

import type { Resolver } from "@/lib/resolver.js";
import type { SchemaValue } from "@/core/index.js";

import type { Config } from "./config.js";
import type { ValidationError } from "./validator.js";

export interface Component {}

export interface ComponentBindings {}

export type ComponentType = keyof Component;

export type Components = {
  [T in ComponentType]: SvelteComponent<
    Component[T],
    {},
    //@ts-expect-error
    ComponentBindings[T]
  >;
};

export type ThemeResolver = Resolver<
  ComponentType,
  Config,
  Components,
  undefined
>;

export interface CommonFieldProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config<V>;
}

export interface CommonComponentProps {
  config: Config;
  errors: ValidationError<unknown>[];
}

export interface FormElements {}

export type FormElement = FormElements[keyof FormElements];

export interface FormElementsProps {}

export type FormElementProps = FormElementsProps[FormElement];
