import type { Component } from "svelte";

import { NodeType } from "$lib/builder/index.js";

import type { NodeProps } from "../model.js";

import ObjectNode from "./object-node.svelte";
import GridNode from "./grid.svelte";

export const NODES: { [T in NodeType]?: Component<NodeProps<T>, {}, "node"> } =
  {
    [NodeType.Object]: ObjectNode,
    [NodeType.Grid]: GridNode,
  };
