import type { AbstractNode, Node, NodeType } from "$lib/builder/index.js";
import type { Attachment } from "svelte/attachments";

export interface NodeProps<T extends NodeType> {
  node: Extract<Node, AbstractNode<T, any>>;
  unmount: () => void;
  handle: Attachment<HTMLElement>;
}
