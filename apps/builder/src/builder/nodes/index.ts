import type { Component } from "svelte";

import { NodeType } from "$lib/builder/index.js";

import type { NodeProps } from "../model.js";

import ObjectNode from "./object-node.svelte";
import GridNode from "./grid.svelte";
import Enum from "./enum.svelte";
import ArrayNode from './array.svelte';

export const NODES: { [T in NodeType]?: Component<NodeProps<T>, {}, "node"> } =
  {
    [NodeType.Object]: ObjectNode,
    [NodeType.Array]: ArrayNode,
    [NodeType.Grid]: GridNode,
    [NodeType.Enum]: Enum,
  };
