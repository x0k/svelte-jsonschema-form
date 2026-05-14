import type { FormState, ResolveFieldType } from "@sjsf/form";
import { resolver as basic } from "@sjsf/form/resolvers/basic";
import { resolver as compat } from "@sjsf/form/resolvers/compat";

import type { Resolver } from "../form.ts";

export type PlaygroundResolver = Resolver;

export const resolvers = {
  basic,
  compat,
} satisfies Record<
  PlaygroundResolver,
  <T>(ctx: FormState<T>) => ResolveFieldType
>;
