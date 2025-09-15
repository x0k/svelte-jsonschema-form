import { getContext, setContext } from "svelte";

const STORE_CONTEXT_KEY = Symbol();

export interface StoreContext {
  storeFile: (signal: AbortSignal, file: File) => Promise<string>;
  retrieveFile: (signal: AbortSignal, key: string) => Promise<File>;
}

export function getStoreContext(): StoreContext {
  return getContext(STORE_CONTEXT_KEY);
}

export function setStoreContext(ctx: StoreContext) {
  setContext(STORE_CONTEXT_KEY, ctx);
}
