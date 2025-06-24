import type { AbstractNode, Node, NodeType } from '$lib/builder/builder.js';

export interface NodeProps<T extends NodeType> {
  node: Extract<Node, AbstractNode<T, any>>
  unmount: () => void
}