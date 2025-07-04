import { getContext, setContext } from "svelte";

import type { Node, NodeId } from "$lib/builder/index.js";

const OBJECT_CONTEXT = Symbol("object-context");

export function setObjectContext(ctx: ObjectContext) {
  setContext(OBJECT_CONTEXT, ctx);
}

export function getObjectContext(): ObjectContext {
  return getContext(OBJECT_CONTEXT);
}

export interface ObjectContext {
  complementary: NodeId | undefined;
}
