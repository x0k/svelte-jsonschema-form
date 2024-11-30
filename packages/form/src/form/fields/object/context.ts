import { getContext, setContext } from "svelte";

export interface ObjectContext {
  newKeySeparator: string;
  validate: () => void;
}

const OBJECT_CONTEXT = Symbol("object-context");

export function getObjectContext(): ObjectContext {
  return getContext(OBJECT_CONTEXT);
}

export function setObjectContext(ctx: ObjectContext) {
  setContext(OBJECT_CONTEXT, ctx);
}
