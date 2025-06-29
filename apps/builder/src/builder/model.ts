import type { AbstractNode, Node, NodeType } from "$lib/builder/index.js";

import type { BuilderDraggable } from "./context.svelte.js";

export interface NodeProps<T extends NodeType> {
  node: Extract<Node, AbstractNode<T, any>>;
  unmount: () => void;
  draggable: BuilderDraggable;
}
