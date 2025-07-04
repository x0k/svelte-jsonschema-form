import { NodeType, type Node, type NodeId } from "./node.js";
import { isCustomizableNode } from "./node-guards.js";

export function getNodeTitle(node: Node): string | undefined {
  return isCustomizableNode(node) ? node.options.title : undefined;
}

export function getNodeProperties(node: Node): Map<NodeId, string> {
  const map = new Map<NodeId, string>();
  if (node.type === NodeType.Object) {
    for (let i = 0; i < node.properties.length; i++) {
      const { id, property } = node.properties[i];
      map.set(id, getNodeTitle(property) ?? `Property ${i + 1}`);
    }
  }
  return map;
}
