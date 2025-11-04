import { createContext } from "svelte";

export interface StoreContext {
  storeFile: (signal: AbortSignal, file: File) => Promise<string>;
  retrieveFile: (signal: AbortSignal, key: string) => Promise<File>;
}

export const [getStoreContext, setStoreContext] = createContext<StoreContext>();
