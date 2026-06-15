import type { NodeId } from "meta/builder";
import { createContext } from "svelte";

export interface ObjectContext {
  complementary: NodeId | undefined;
}

export const [getObjectContext, setObjectContext] =
  createContext<ObjectContext>();
