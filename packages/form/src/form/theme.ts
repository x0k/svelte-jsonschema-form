import type { Component as SvelteComponent } from "svelte";

import type { Equal, ExpandAndEqual } from "@/lib/types.js";
import { chain, fromRecord, type Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";
import { createMessage } from "./error-message.svelte";

export interface ComponentProps {}

export interface ComponentBindings {}

export type ComponentType = keyof ComponentProps;

export type Definitions = {
  [T in ComponentType]: SvelteComponent<
    ComponentProps[T],
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
    ExpandAndEqual<ComponentProps[T], ComponentProps[C]>,
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

export const fallbackComponent: ThemeResolver = <T extends ComponentType>(
  type: T
) => createMessage(`Component ${type} not found`) as Definitions[T];

export function createIncompleteTheme(definitions: Partial<Definitions>) {
  return chain(fromRecord(definitions), fallbackComponent);
}
