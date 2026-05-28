import type { FromSchema } from "json-schema-to-ts";
import type { Schema } from "@sjsf/form";
import { NodeType, RangeValueType } from "meta/builder";

import type { AbstractCustomizableNode, CommonOptions, NodeId } from "./node-base.js";
import type { StringNode } from "./string-node.js";
import type { NumberNode } from "./number-node.js";
import type { CustomizableNodeType, NodeOverridesMap } from "./node.js";
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

export const RANGE_NODE_OPTIONS_SCHEMA = {
  title: "Range options",
  type: "object",
  properties: {
    widget: {
      title: "Widget",
      type: "string",
      default: "dateRangePickerWidget"
    },
    help: {
      title: "Help",
      type: "string"
    }
  },
  required: ["widget"]
} as const satisfies Schema;

export type RangeOptions = FromSchema<typeof RANGE_NODE_OPTIONS_SCHEMA>;

export type RangeNode = AbstractCustomizableNode<NodeType.Range, RangeOptions> &
  (
    | {
        valueType: RangeValueType.String;
        startNode: StringNode;
        endNode: StringNode;
      }
    | {
        valueType: RangeValueType.Number;
        startNode: NumberNode;
        endNode: NumberNode;
      }
  );

const RANGE_VALUE_TYPE_TO_WIDGET: Record<RangeValueType, string> = {
  [RangeValueType.String]: "dateRangePickerWidget",
  [RangeValueType.Number]: "rangeSliderWidget"
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
