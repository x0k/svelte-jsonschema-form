import type { Component } from "svelte";

import { NodeType, type CustomizableNodeType } from "$lib/builder/index.js";

import type { NodeProps } from "../model.js";

import { EnumNode } from "./enum/index.js";
import { ObjectNode, ObjectPropertyNode } from "./object/index.js";
import GridNode from "./grid.svelte";
import ArrayNode from "./array.svelte";
import StringNode from "./string.svelte";

export const NODES: {
  [T in NodeType]?: Component<NodeProps<T>, {}, "node">;
} = {
  [NodeType.Object]: ObjectNode,
  [NodeType.ObjectProperty]: ObjectPropertyNode,
  [NodeType.Array]: ArrayNode,
  [NodeType.Grid]: GridNode,
  [NodeType.Enum]: EnumNode,
  [NodeType.String]: StringNode,
} satisfies {
  [T in CustomizableNodeType]: Component<NodeProps<T>, {}, "node">;
} & {
  [T in NodeType]?: Component<NodeProps<T>, {}, "node">;
};
