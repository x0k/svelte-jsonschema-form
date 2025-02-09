import type { Component as SvelteComponent } from "svelte";

import type { Resolver } from "@/lib/resolver.js";
import type { SchemaValue } from "@/core/index.js";

import type { Config } from "./config.js";
import type { ValidationError } from "./validator.js";

export interface Component {}

export interface ComponentBindings {}

export type ComponentType = keyof Component;

export type Components = {
  [T in ComponentType]: SvelteComponent<Component[T], {}, ComponentBindings[T]>;
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

export type FormElement = FormComponent[keyof FormComponent];
