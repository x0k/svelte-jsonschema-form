import { getContext, setContext } from "svelte";

export interface ObjectContext {
  /** @deprecated */
  newKeySeparator: string;
  /** @deprecated */
  validate: () => void;
  addProperty(): void
  renameProperty(oldProp: string, newProp: string): void
  removeProperty(prop: string): void
}

const OBJECT_CONTEXT = Symbol("object-context");

export function getObjectContext(): ObjectContext {
  return getContext(OBJECT_CONTEXT);
}

export function setObjectContext(ctx: ObjectContext) {
  setContext(OBJECT_CONTEXT, ctx);
}
