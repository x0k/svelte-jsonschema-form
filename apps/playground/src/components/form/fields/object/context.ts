import { getContext, setContext } from "svelte";

import type { SchemaObjectValue } from "../../schema";

export interface ObjectContext {
  value: SchemaObjectValue | undefined;
  newKeySeparator: string;
}

const OBJECT_CONTEXT = Symbol("object-context");

export function getObjectContext(): ObjectContext {
  return getContext(OBJECT_CONTEXT);
}

export function setObjectContext(ctx: ObjectContext) {
  setContext(OBJECT_CONTEXT, ctx);
}
