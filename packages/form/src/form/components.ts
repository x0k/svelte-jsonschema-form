import type { Component as SvelteComponent } from "svelte";

import type { Equal, ExpandAndEqual } from "@/lib/types.js";
import type { Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";

export interface ComponentProps {}

export interface ComponentBindings {}

export type ComponentType = keyof ComponentProps;

export interface FoundationalComponents {}

export type FoundationalComponent = keyof FoundationalComponents &
  ComponentType;

export type ComponentDefinition<T extends ComponentType> = SvelteComponent<
  ComponentProps[T],
  {},
  //@ts-expect-error
  ComponentBindings[T]
>;

export type ComponentDefinitions = {
  [T in ComponentType]: ComponentDefinition<T>;
};

export type ExtendableComponentDefinitions = {
  [T in FoundationalComponent]: ComponentDefinitions[T];
} & {
  [T in Exclude<
    ComponentType,
    FoundationalComponent
  >]?: ComponentDefinitions[T];
};

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
export type CompatibleComponentDefinitions = {
  [T in ComponentType]: {
    [K in CompatibleComponentType<T>]: ComponentDefinitions[K];
  }[CompatibleComponentType<T>];
};

export type Theme = Resolver<
  Partial<Record<ComponentType, Config>>,
  Partial<CompatibleComponentDefinitions>
>;
