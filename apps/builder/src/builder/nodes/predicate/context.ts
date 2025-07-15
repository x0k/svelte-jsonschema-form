import { getContext, setContext } from "svelte";

import type { Node } from "$lib/builder/index.js";

const OPERATOR_CONTEXT = Symbol("operator-context");

interface PredicateContext {
  node: Node;
}

export function setPredicateContext(ctx: PredicateContext) {
  setContext(OPERATOR_CONTEXT, ctx);
}

export function getPredicateContext(): PredicateContext {
  return getContext(OPERATOR_CONTEXT);
}
