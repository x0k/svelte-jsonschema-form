import type { Component as SvelteComponent } from "svelte";

import type { Equal, ExpandAndEqual } from "@/lib/types.js";
import { fromRecord, type Resolver } from "@/lib/resolver.js";

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

export interface FormElements {}

export type FormElement = FormElements[keyof FormElements];

export interface FormProps {}

export type FormAttributes = FormProps[keyof FormElements];

export type CompatibleComponentType<T extends ComponentType> = {
  [C in ComponentType]: [
    ExpandAndEqual<Components[T], Components[C]>,
    Equal<ComponentBindings[T], ComponentBindings[C]>,
  ] extends [true, true]
    ? C
    : never;
}[ComponentType];

export type CompatibleDefinitions = {
  [T in ComponentType]: {
    [K in CompatibleComponentType<T>]: Definitions[K];
  }[CompatibleComponentType<T>];
};

export type ThemeResolver = Resolver<
  ComponentType,
  Config,
  CompatibleDefinitions
>;

export const createTheme = fromRecord as (
  definitions: Definitions
) => ThemeResolver;

export type IncompleteThemeResolver = Resolver<
  ComponentType,
  Config,
  CompatibleDefinitions,
  undefined
>;

export const createIncompleteTheme = fromRecord as (
  definitions: Partial<Definitions>
) => IncompleteThemeResolver;
