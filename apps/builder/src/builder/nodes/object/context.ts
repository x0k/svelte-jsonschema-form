import { createContext } from "svelte";

import type { NodeId } from "$lib/builder/index.js";

export interface ObjectContext {
  complementary: NodeId | undefined;
}

export const [getObjectContext, setObjectContext] =
  createContext<ObjectContext>();
