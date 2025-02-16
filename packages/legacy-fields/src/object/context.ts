import { getContext, setContext } from "svelte";

import type { Config } from '@sjsf/form';

export interface ObjectContext {
  addProperty(): void
  renameProperty(oldProp: string, newProp: string, config: Config): void
  removeProperty(prop: string): void
}

const OBJECT_CONTEXT = Symbol("object-context");

export function getObjectContext(): ObjectContext {
  return getContext(OBJECT_CONTEXT);
}

export function setObjectContext(ctx: ObjectContext) {
  setContext(OBJECT_CONTEXT, ctx);
}
