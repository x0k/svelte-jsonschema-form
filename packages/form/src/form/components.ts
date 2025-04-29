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

type Transforms<FromProps, ToProps> = {
  [K in keyof ToProps]: {
    transform(props: FromProps): ToProps[K];
  };
};

type Recovers<FromProps, ToProps> = {
  [K in keyof ToProps]: {
    recover(props: FromProps, value: ToProps[K]): void;
  };
};

export type ComponentPropertiesCast<
  FromType extends ComponentType,
  ToType extends ComponentType,
  FromProps = ComponentProps[FromType],
  ToProps = ComponentProps[ToType],
  Transform extends Transforms<FromProps, ToProps> = Transforms<
    FromProps,
    ToProps
  >,
  Recover extends Recovers<FromProps, ToProps> = Recovers<FromProps, ToProps>
> = OmitNever<{
  [K in keyof ToProps]: K extends keyof FromProps
    ? // Is FromProp assignable to ToProp?
      FromProps[K] extends ToProps[K]
      ? // Then transform is optional, lets check bindings
        K extends ComponentBindings[ToType]
        ? // Prop is bindable, is ToProp assignable to FromProp?
          ToProps[K] extends FromProps[K]
          ? // Prop is assignable, so it is fully optional
            never
          : // Prop is not assignable, recover required
            Recover[K] & Partial<Transform[K]>
        : // Prop is not bindable, so it is fully optional
          never
      : // Transform is required, lets check bindings
        Transform[K] &
          (K extends ComponentBindings[ToType]
            ? // Prop is bindable, is ToProp assignable to FromProp
              ToProps[K] extends FromProps[K]
              ? // Prop is assignable, recover is optional
                Partial<Recover[K]>
              : // Props is not assignable, recover is required
                Recover[K]
            : // Prop is not bindable, no need for recover
              {})
    : // Is property optional?
    ToProps[K] extends undefined
    ? never
    : Transform[K] &
        // We may bind it to another field
        (K extends ComponentBindings[ToType] ? Partial<Recover[K]> : {});
}> &
  Partial<
    OmitNever<{
      [K in keyof ToProps]: Partial<
        K extends keyof FromProps
          ? // Is FromProp assignable to ToProp?
            FromProps[K] extends ToProps[K]
            ? // Transform is optional, check bindings
              K extends ComponentBindings[ToType]
              ? // Prop is bindable, is ToProp assignable to FromProp?
                ToProps[K] extends FromProps[K]
                ? // Prop is assignable, recover is also optional
                  Transform[K] & Recover[K]
                : // Prop is not assignable, recover required
                  never
              : // Prop is not bindable, only transform can be applied
                Transform[K]
            : // Transform is required
              never
          : // Is prop optional?
          ToProps[K] extends undefined
          ? Transform &
              // Is prop bindable?
              (K extends ComponentBindings[ToType] ? Recover[K] : {})
          : // Transform is required
            never
      >;
    }>
  >;

export interface ComponentCast<
  From extends ComponentType,
  To extends ComponentType
> {
  component: To | ComponentDefinition<To>;
  properties: ResolvableUiOption<ComponentPropertiesCast<From, To>>;
}

export type ComponentCasts<From extends ComponentType> = {
  [K in ComponentType]: ComponentCast<From, K>;
}[ComponentType];

export type Theme = Resolver<
  Partial<Record<ComponentType, Config>>,
  Partial<CompatibleComponentDefinitions>
>;

export function castComponent<
  From extends ComponentType,
  To extends ComponentType
>(
  Component: ComponentDefinition<To>,
  propsCast: ComponentPropertiesCast<From, To>
): ComponentDefinition<From> {
  return function (internals, props) {
    const proxy = new Proxy(props, {
      get(target, p, receiver) {
        const cast = propsCast[p as keyof typeof propsCast];
        if (cast !== undefined) {
          const { transform } = cast;
          if (transform !== undefined) {
            return transform(target);
          }
        }
        return Reflect.get(target, p, receiver);
      },
      set(target, p, newValue, receiver) {
        const cast = propsCast[p as keyof typeof propsCast];
        if (cast !== undefined && "recover" in cast) {
          const { recover } = cast;
          if (recover !== undefined) {
            recover(target, newValue);
            return true;
          }
        }
        return Reflect.set(target, p, newValue, receiver);
      },
      has(target, p) {
        return Reflect.has(target, p) || p in propsCast;
      },
      // TODO: ownKeys
    }) as unknown as ComponentProps[To];
    return Component(internals, proxy) as ReturnType<ComponentDefinition<From>>;
  };
}
