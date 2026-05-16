import type { FormState, ResolveFieldType } from "@sjsf/form";
import { resolver as basic } from "@sjsf/form/resolvers/basic";
import { resolver as compat } from "@sjsf/form/resolvers/compat";

import { resolvers, type Resolver } from "../form.ts";

export type PlaygroundResolver = Resolver;

export { resolvers as playgroundResolvers };

export const PLAYGROUND_RESOLVERS = {
  basic,
  compat,
} satisfies Record<
  PlaygroundResolver,
  <T>(ctx: FormState<T>) => ResolveFieldType
>;
