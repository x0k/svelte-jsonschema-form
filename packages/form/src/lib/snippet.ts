import { BROWSER } from "esm-env";
import type { ComponentInternals, Snippet } from "svelte";

import type { OmitItems } from "./types.js";

type Binds<Args extends unknown[]> = Args extends [...infer Bind, any]
  ? Args | Binds<Bind>
  : never;

export function partialSnippet<
  Args extends unknown[],
  Bind extends Binds<Args>,
>(snippet: Snippet<Args>, ...args: Bind): Snippet<OmitItems<Args, Bind>> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const getters = BROWSER ? args.map((a) => () => a) : args;
  type Rest = OmitItems<Args, Bind>;
  return ((internals: ComponentInternals, ...args: Rest) =>
    snippet(
      // @ts-expect-error hack
      internals,
      ...getters,
      ...args
    )) as unknown as Snippet<Rest>;
}
