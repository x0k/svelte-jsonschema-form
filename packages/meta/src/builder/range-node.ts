import type { Schema } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

import type { AbstractCustomizableNode } from "./node-base.ts";
import { NodeType, RangeValueType } from "./node-types.ts";
import type { NumberNode } from "./number-node.ts";
import type { StringNode } from "./string-node.ts";

export const RANGE_NODE_OPTIONS_SCHEMA = {
  title: "Range options",
  type: "object",
  properties: {
    widget: {
      title: "Widget",
      type: "string",
      default: "dateRangePickerWidget",
    },
    help: {
      title: "Help",
      type: "string",
    },
  },
  required: ["widget"],
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
