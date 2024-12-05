import type {
  Component,
  ComponentInternals,
  ComponentProps,
  Snippet,
} from "svelte";

import type { Label, Labels } from "./translation.js";

export type Icons = {
  [L in Label]?: Snippet<[[L, ...Labels[L]]]>;
};

// @deprecated
// TODO: remove this function and use snippets export
// introduced in svelte v5.5.0
export function asSnippet<C extends Component>(
  Component: C,
  props: Partial<ComponentProps<C>> = {}
): Snippet {
  // @ts-expect-error
  return (internals: ComponentInternals) => {
    Component(internals, props);
  };
}
