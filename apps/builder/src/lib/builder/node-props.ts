import type { Node, NodeId } from "./node.js";
import { isCustomizableNode, isGridNode, isObjectNode } from "./node-guards.js";

export function getNodeTitle(node: Node): string | undefined {
  return isCustomizableNode(node) ? node.options.title : undefined;
}

export function getNodeProperties(node: Node): Map<NodeId, string> {
  const map = new Map<NodeId, string>();
  if (isObjectNode(node)) {
    for (let i = 0; i < node.properties.length; i++) {
      const { id, property } = node.properties[i];
      map.set(id, getNodeTitle(property) ?? `Property ${i + 1}`);
    }
  } else if (isGridNode(node)) {
    for (let i = 0; i < node.cells.length; i++) {
      const { node: cell, x, y } = node.cells[i];
      map.set(cell.id, getNodeTitle(cell) ?? `Cell (${x + 1}, ${y + 1})`);
    }
  }
  return map;
}

export function getNodeProperty(n: Node, propertyId: NodeId) {
  if (isObjectNode(n)) {
    return n.properties.find((p) => p.id === propertyId)?.property;
  }
  if (isGridNode(n)) {
    return n.cells.find((c) => c.node.id === propertyId)?.node;
  }
  return undefined;
}
