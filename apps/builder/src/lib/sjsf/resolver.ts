import { resolver as basic } from "@sjsf/form/resolvers/basic";
import { resolver as compat } from "@sjsf/form/resolvers/compat";

export enum Resolver {
  Basic = "basic",
  Compat = "compat",
}

export const RESOLVERS = Object.values(Resolver);

export const RESOLVER_TITLES: Record<Resolver, string> = {
  [Resolver.Basic]: "basic",
  [Resolver.Compat]: "compat",
};

export const SJSF_RESOLVERS: Record<Resolver, typeof basic> = {
  [Resolver.Basic]: basic,
  [Resolver.Compat]: compat,
};
