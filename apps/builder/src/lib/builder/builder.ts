import type { Brand } from "@sjsf/form/lib/types";

export enum NodeType {
  Object = "object",
  Text = "text",
}

export type NodeId = Brand<"node-id">;

export interface AbstractNode<T extends NodeType, O extends {}> {
  id: NodeId;
  type: T;
  options: O;
}

export interface ObjectNode extends AbstractNode<NodeType.Object, {}> {
  children: Node[];
}

export interface TextNode extends AbstractNode<NodeType.Text, {}> {}

export type Node = ObjectNode | TextNode;

const NODE_FACTORIES = {
  [NodeType.Object]: (id) => ({
    id,
    type: NodeType.Object,
    children: [],
    options: {},
  }),
  [NodeType.Text]: (id) => ({
    id,
    type: NodeType.Text,
    options: {},
  }),
} satisfies {
  [T in NodeType]: (id: NodeId) => Extract<Node, AbstractNode<T, any>>;
};

export function nodeId(): NodeId {
  return crypto.randomUUID() as NodeId;
}

export function createNode(type: NodeType): Node {
  return NODE_FACTORIES[type](nodeId());
}
