import { createContext } from "svelte";
import type { NodeId } from "meta/builder";

export interface ObjectContext {
  complementary: NodeId | undefined;
}

export const [getObjectContext, setObjectContext] =
  createContext<ObjectContext>();
