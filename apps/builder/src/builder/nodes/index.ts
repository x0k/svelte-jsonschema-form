import type { Component } from "svelte";

import { NodeType } from "$lib/builder/index.js";

import type { NodeProps } from "../model.js";

import ObjectNode from "./object-node.svelte";
import TextNode from "./text.svelte";
import GridNode from './grid.svelte';

export const NODES = {
  [NodeType.Object]: ObjectNode,
  [NodeType.Grid]: GridNode,
  [NodeType.String]: TextNode,
} satisfies { [T in NodeType]: Component<NodeProps<T>, {}, "node"> };
