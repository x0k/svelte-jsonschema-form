import type { Component } from "svelte";

import { NodeType, type SelectableNodeType } from "$lib/builder/index.js";

import type { NodeProps } from "../model.js";

import ObjectNode from "./object-node.svelte";
import GridNode from "./grid.svelte";
import EnumNode from "./enum.svelte";
import ArrayNode from "./array.svelte";
import StringNode from "./string.svelte";

export const NODES: {
  [T in NodeType]?: Component<NodeProps<T>, {}, "node">;
} = {
  [NodeType.Object]: ObjectNode,
  [NodeType.Array]: ArrayNode,
  [NodeType.Grid]: GridNode,
  [NodeType.Enum]: EnumNode,
  [NodeType.String]: StringNode,
} satisfies {
  [T in SelectableNodeType]: Component<NodeProps<T>, {}, "node">;
};
