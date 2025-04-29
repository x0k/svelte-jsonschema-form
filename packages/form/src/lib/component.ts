import type { Component } from "svelte";

export type AnyComponent = Component<any, any, any>;

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

type PropsCast<
  FromProps extends Record<string, any>,
  ToProps extends Record<string, any>,
  ToBindings extends keyof ToProps | "",
  Transform extends Transforms<FromProps, ToProps> = Transforms<
    FromProps,
    ToProps
  >,
  Recover extends Recovers<FromProps, ToProps> = Recovers<FromProps, ToProps>,
> = OmitNever<{
  [K in keyof ToProps]: K extends keyof FromProps
    ? // Is FromProp assignable to ToProp?
      FromProps[K] extends ToProps[K]
      ? // Then transform is optional, lets check bindings
        K extends ToBindings
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
          (K extends ToBindings
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
          (K extends ToBindings ? Partial<Recover[K]> : {});
}> &
  Partial<
    OmitNever<{
      [K in keyof ToProps]: Partial<
        K extends keyof FromProps
          ? // Is FromProp assignable to ToProp?
            FromProps[K] extends ToProps[K]
            ? // Transform is optional, check bindings
              K extends ToBindings
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
                (K extends ToBindings ? Recover[K] : {})
            : // Transform is required
              never
      >;
    }>
  >;

export type PropertiesCast<From extends AnyComponent, To extends AnyComponent> =
  From extends Component<infer FromProps, any, any>
    ? To extends Component<infer ToProps, any, infer ToBindings>
      ? PropsCast<FromProps, ToProps, ToBindings>
      : never
    : never;

export function cast<From extends AnyComponent, To extends AnyComponent>(
  Component: To,
  propsCast: PropertiesCast<From, To>
): From {
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
        return (
          Reflect.has(target, p) ||
          propsCast?.[p as keyof typeof propsCast]?.transform !== undefined
        );
      },
      // TODO: ownKeys
    });
    return Component(internals, proxy);
  } as From;
}
