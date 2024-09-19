import type { ComponentOptions, ComponentType, Component } from "./component";

export type ComponentResolver<T extends ComponentType> = (
  options: ComponentOptions
) => Component<T>;

export type ComponentResolvers = {
  [T in ComponentType]: ComponentResolver<T>;
};

export type ComponentsResolver = <T extends ComponentType>(
  type: T,
  options: ComponentOptions
) => Component<T>;

export function createComponentsResolver(
  resolvers: ComponentResolvers
): ComponentsResolver {
  return (type, options) => resolvers[type](options);
}
