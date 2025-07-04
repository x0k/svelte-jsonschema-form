import type { NodeId } from "$lib/builder/node.js";
import { getContext, setContext } from "svelte";

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
