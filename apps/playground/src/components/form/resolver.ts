import type { ComponentOptions, ComponentType, Component } from "./components";

export type ComponentResolver<T extends ComponentType> = (
  options: ComponentOptions<T>
) => Component<T>;

export type ComponentResolvers = {
  [T in ComponentType]: ComponentResolver<T>;
};

export type ComponentsResolver = <T extends ComponentType>(
  options: ComponentOptions<T>
) => Component<T>;

export function createComponentsResolver(
  components: ComponentResolvers
): ComponentsResolver {
  return (options) => components[options.type](options);
}
