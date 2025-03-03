import type { Component as SvelteComponent } from "svelte";

import type { AnyKey, Equal, ExpandAndEqual } from "@/lib/types.js";
import {
  chain,
  fromRecord,
  type Resolved,
  type Resolver,
} from "@/lib/resolver.js";
import type { AnyComponent } from "@/lib/svelte.svelte.js";

import type { Config } from "./config.js";
import { createMessage } from "./error-message.svelte";

export interface ComponentProps {}

export interface ComponentBindings {}

export type ComponentType = keyof ComponentProps;

export interface FoundationalComponents {}

export type FoundationalComponent = keyof FoundationalComponents &
  ComponentType;

export type Definitions = {
  [T in ComponentType]: SvelteComponent<
    ComponentProps[T],
    {},
    //@ts-expect-error
    ComponentBindings[T]
  >;
};

export type ExtendableDefinitions = {
  [T in FoundationalComponent]: Definitions[T];
} & {
  [T in Exclude<ComponentType, FoundationalComponent>]?: Definitions[T];
};

export interface FormElements {}

export type FormElement = FormElements[keyof FormElements];

export interface FormProps {}

export type FormAttributes = FormProps[keyof FormElements] extends never
  ? {}
  : FormProps[keyof FormElements];

// TODO: Optional fields in component props should be considered
export type CompatibleComponentType<T extends ComponentType> = {
  [C in ComponentType]: [
    ExpandAndEqual<ComponentProps[T], ComponentProps[C]>,
    Equal<ComponentBindings[T], ComponentBindings[C]>,
  ] extends [true, true]
    ? C
    : never;
}[ComponentType];

/**
 * NOTE: Currently this type is useless because compatible components have
 * the same definitions
 */
export type CompatibleDefinitions = {
  [T in ComponentType]: {
    [K in CompatibleComponentType<T>]: Definitions[K];
  }[CompatibleComponentType<T>];
};

export type Theme = Resolver<
  Record<ComponentType, Config>,
  CompatibleDefinitions
>;

const fallbackComponent = <T extends AnyKey>(type: T) =>
  createMessage(`Component ${type.toString()} not found`) as Resolved<
    T,
    Record<ComponentType, AnyComponent>
  >;

export function createTheme(definitions: Partial<Definitions>): Theme {
  return chain(fromRecord(definitions), fallbackComponent);
}
