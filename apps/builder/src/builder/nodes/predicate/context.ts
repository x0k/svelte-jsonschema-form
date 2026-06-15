import { createContext } from "svelte";

import type { Node } from "$lib/builder/index.js";

interface PredicateContext {
  node: Node;
}

export const [getPredicateContext, setPredicateContext] =
  createContext<PredicateContext>();
