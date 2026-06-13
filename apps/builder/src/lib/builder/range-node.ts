import {
  NodeType,
  RangeValueType,
  type NodeId,
  type CommonOptions,
  type RangeOptions,
  type RangeNode,
  type CustomizableNodeType,
  type NodeOverridesMap,
  RANGE_VALUE_TYPE_TO_WIDGET
} from "meta/builder";

import { createNode } from "./node-factories.js";

export const RANGE_VALUE_TYPE_TITLES: Record<RangeValueType, string> = {
  [RangeValueType.String]: "String",
  [RangeValueType.Number]: "Number"
};

export const RANGE_VALUE_TYPES = Object.values(RangeValueType);

export const RANGE_VALUE_TYPE_TO_NODE_TYPE: Record<RangeValueType, NodeType> = {
  [RangeValueType.String]: NodeType.String,
  [RangeValueType.Number]: NodeType.Number
};

function createNodeWithTitle<T extends CustomizableNodeType>(
  type: T,
  title: string,
  overrides: NodeOverridesMap
) {
  const node = createNode(type, overrides);
  node.options.title = title;
  return node;
}

export function createRangeNode<T extends RangeValueType>(
  id: NodeId,
  valueType: T,
  options: RangeOptions & CommonOptions,
  overrides: NodeOverridesMap
): RangeNode {
  const base = {
    id,
    type: NodeType.Range,
    options: {
      ...options,
      widget: RANGE_VALUE_TYPE_TO_WIDGET[valueType]
    }
  } as const;
  switch (valueType) {
    case RangeValueType.String:
      return {
        ...base,
        valueType,
        startNode: createNodeWithTitle(NodeType.String, "Start", overrides),
        endNode: createNodeWithTitle(NodeType.String, "End", overrides)
      };
    case RangeValueType.Number:
      return {
        ...base,
        valueType,
        startNode: createNodeWithTitle(NodeType.Number, "Start", overrides),
        endNode: createNodeWithTitle(NodeType.Number, "End", overrides)
      };
  }
}
