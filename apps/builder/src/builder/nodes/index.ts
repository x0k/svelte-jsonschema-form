import type { Component } from "svelte";

import { NodeType } from "$lib/builder/index.js";

import type { NodeProps } from "../model.js";

import { default as ObjectNode } from "./object-node.svelte";
import { default as TextNode } from "./text.svelte";

export const NODES = {
  [NodeType.Object]: ObjectNode,
  [NodeType.Text]: TextNode,
} satisfies { [T in NodeType]: Component<NodeProps<T>, {}, "node"> };
