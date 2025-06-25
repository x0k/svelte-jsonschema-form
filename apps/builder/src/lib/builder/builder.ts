import type { Brand } from "@sjsf/form/lib/types";

export enum NodeType {
  Object = "object",
  String = "string",
}

export type NodeId = Brand<"node-id">;

export interface AbstractNode<T extends NodeType> {
  id: NodeId;
  type: T;
}

export interface FieldNode {
  title: string;
}

export interface ObjectNode extends AbstractNode<NodeType.Object>, FieldNode {
  children: Node[];
}

export interface TextNode extends AbstractNode<NodeType.String>, FieldNode {}

export type Node = ObjectNode | TextNode;

const NODE_FACTORIES = {
  [NodeType.Object]: (id) => ({
    id,
    type: NodeType.Object,
    children: [],
    title: "Group title",
  }),
  [NodeType.String]: (id) => ({
    id,
    type: NodeType.String,
    title: "Text field",
  }),
} satisfies {
  [T in NodeType]: (id: NodeId) => Extract<Node, AbstractNode<T>>;
};

export function nodeId(): NodeId {
  return crypto.randomUUID() as NodeId;
}

export function createNode(type: NodeType): Node {
  return NODE_FACTORIES[type](nodeId());
}
