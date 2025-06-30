import type { AbstractSelectableNode, Node, NodeType } from "$lib/builder/index.js";

import type { BuilderDraggable } from "./context.svelte.js";

export interface NodeProps<T extends NodeType> {
  node: Extract<Node, AbstractSelectableNode<T, any>>;
  draggable: BuilderDraggable;
  unmount: () => void;
}
