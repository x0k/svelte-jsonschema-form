import type { Brand } from "@sjsf/form/lib/types";

export enum NodeType {
  Object = "object",
  String = "string",
  Grid = "grid",
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

export interface GridCell {
  x: number;
  y: number;
  w: number;
  h: number;
  node: Node;
}

export interface GridNode extends AbstractNode<NodeType.Grid>, FieldNode {
  width: number;
  height: number;
  cells: GridCell[];
}

export interface TextNode extends AbstractNode<NodeType.String>, FieldNode {}

export type Node = ObjectNode | GridNode | TextNode;

const NODE_FACTORIES = {
  [NodeType.Object]: (id) => ({
    id,
    type: NodeType.Object,
    children: [],
    title: "Group title",
  }),
  [NodeType.Grid]: (id) => ({
    id,
    type: NodeType.Grid,
    cells: [],
    title: "Grid title",
    width: 3,
    height: 4,
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
