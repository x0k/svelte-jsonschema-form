import type { Visitor } from "$lib/visitor.js";

import { NodeType, type Node } from "./node.js";
import { isUOperator, isNOperator, isPropertyOperator } from "./node-guards.js";

export interface NodeTraverserContext<T extends NodeType> {
  parentType: T | "root";
}

export type NodeVisitor<T extends NodeType, R> = Visitor<
  Node,
  NodeTraverserContext<T>,
  R
>;

export function createNodeTraverser<R>(visitor: NodeVisitor<NodeType, R>) {
  return function* traverse(
    node: Node,
    ctx: NodeTraverserContext<NodeType> = { parentType: "root" }
  ): Generator<R> {
    if (visitor.onEnter) {
      yield* visitor.onEnter(node, ctx);
    }
    const subCtx: NodeTraverserContext<NodeType> = {
      parentType: node.type,
    };
    if (node.type === NodeType.Object) {
      for (const prop of node.properties) {
        yield* traverse(prop, subCtx);
      }
    } else if (node.type === NodeType.ObjectProperty) {
      yield* traverse(node.property, subCtx);
      for (const dep of node.dependencies) {
        yield* traverse(dep, subCtx);
      }
    } else if (node.type === NodeType.ObjectPropertyDependency) {
      if (node.predicate !== undefined) {
        yield* traverse(node.predicate, subCtx);
      }
      for (const prop of node.properties) {
        yield* traverse(prop, subCtx);
      }
    } else if (node.type === NodeType.Predicate) {
      if (node.operator !== undefined) {
        yield* traverse(node.operator, subCtx);
      }
    } else if (node.type === NodeType.Operator) {
      if (isUOperator(node)) {
        if (node.operand !== undefined) {
          yield* traverse(node.operand, subCtx);
        }
      } else if (isNOperator(node)) {
        for (const operand of node.operands) {
          yield* traverse(operand, subCtx);
        }
      } else if (isPropertyOperator(node)) {
        if (node.operator !== undefined) {
          yield* traverse(node.operator, subCtx);
        }
      }
    } else if (node.type === NodeType.Array) {
      if (node.item !== undefined) {
        yield* traverse(node.item, subCtx);
      }
    } else if (node.type === NodeType.Grid) {
      for (const cell of node.cells) {
        yield* traverse(cell.node, subCtx);
      }
    }
    if (visitor.onLeave) {
      yield* visitor.onLeave(node, ctx);
    }
  };
}
