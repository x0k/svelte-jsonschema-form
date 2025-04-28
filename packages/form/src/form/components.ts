import type { Component as SvelteComponent } from "svelte";

import type { Expand } from "@/lib/types.js";
import type { Resolver } from "@/lib/resolver.js";

import type { Config } from "./config.js";
import type { ResolvableUiOption } from "./ui-schema.js";

export interface ComponentProps {}

export interface ComponentBindings {}

export type ComponentType = keyof ComponentProps;

export interface FoundationalComponents {}

export type FoundationalComponentType = keyof FoundationalComponents &
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

type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type ComponentPropertiesCast<
  FromType extends ComponentType,
  ToType extends ComponentType,
  FromProps = ComponentProps[FromType],
  ToProps = ComponentProps[ToType],
> = OmitNever<{
  [K in keyof ToProps]: K extends keyof FromProps
    ? FromProps[K] extends ToProps[K]
      ? never
      : {
          transform: ResolvableUiOption<(value: FromProps[K]) => ToProps[K]>;
        } & (K extends ComponentBindings[ToType]
          ? ToProps[K] extends FromProps[K]
            ? {
                recover?: ResolvableUiOption<
                  (value: ToProps[K]) => FromProps[K]
                >;
              }
            : {
                recover: ResolvableUiOption<
                  (value: ToProps[K]) => FromProps[K]
                >;
              }
          : {})
    : undefined extends ToProps[K]
      ? {
          transform?: ResolvableUiOption<() => ToProps[K]>;
        }
      : {
          transform: ResolvableUiOption<() => ToProps[K]>;
        };
}>;

export type ComponentCast<T extends ComponentType> = {
  [K in ComponentType]: {
    component: K | ComponentDefinition<K>;
    properties: ComponentPropertiesCast<T, K>;
  };
}[ComponentType];

export type Theme = Resolver<
  Partial<Record<ComponentType, Config>>,
  Partial<CompatibleComponentDefinitions>
>;
