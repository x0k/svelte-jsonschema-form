import { createContext } from "svelte";

export interface NodeContext {
  isDragged: boolean;
}

export const [getNodeContext, setNodeContext] = createContext<NodeContext>();
