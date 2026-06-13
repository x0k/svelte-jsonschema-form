import { NodeType } from "./node-types.ts";
import type { CustomizableNodeType } from "./node-types-full.ts";

export const BASE_CUSTOMIZABLE_NODE_TYPES: CustomizableNodeType[] = [
  NodeType.Object,
  NodeType.Grid,
  NodeType.Array,
  NodeType.Enum,
  NodeType.MultiEnum,
  NodeType.String,
  NodeType.Number,
  NodeType.Boolean,
  NodeType.File,
];
