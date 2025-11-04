import type { Snippet, Component as SvelteComponent } from "svelte";
import type { HTMLFormAttributes } from "svelte/elements";

import type { Expand } from "@/lib/types.js";
import type { Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";

export interface ComponentProps {
  form: {
    config: Config;
    ref?: HTMLFormElement | undefined;
    children: Snippet;
    attributes?: HTMLFormAttributes | undefined;
  };
  submitButton: {
    config: Config;
    children: Snippet;
  };
}

export interface ComponentBindings {
  form: "ref";
  submitButton: "";
}

export type ComponentType = keyof ComponentProps;

export interface FoundationalComponents {
  form: {};
  submitButton: {};
}

export type FoundationalComponentType = keyof FoundationalComponents &
  ComponentType;

export type ComponentDefinition<T extends ComponentType> = SvelteComponent<
  ComponentProps[T],
  {},
  //@ts-expect-error TODO: fix if possible
  ComponentBindings[T]
>;

export type ComponentDefinitions = {
  [T in ComponentType]: ComponentDefinition<T>;
};

export type CompatibleComponentType<T extends ComponentType> = {
  [C in ComponentType]: Expand<ComponentProps[T]> extends Expand<
    ComponentProps[C]
  >
    ? ComponentBindings[T] extends ComponentBindings[C]
      ? C
      : never
    : never;
}[ComponentType];

export type CompatibleComponentDefinitions = {
  [T in ComponentType]: {
    [K in CompatibleComponentType<T>]: ComponentDefinitions[K];
  }[CompatibleComponentType<T>];
};

export type Theme = Resolver<
  Partial<Record<ComponentType, Config>>,
  Partial<CompatibleComponentDefinitions>
>;
