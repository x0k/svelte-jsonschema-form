import type { Component } from "svelte";

import { NodeType, type CustomizableNodeType } from "$lib/builder/index.js";

import type { NodeProps } from "../model.js";

import { EnumNode } from "./enum/index.js";
import {
  ObjectNode,
  ObjectPropertyDependencyNode,
  ObjectPropertyNode,
} from "./object/index.js";
import { OperatorNode, Predicate } from "./predicate/index.js";
import GridNode from "./grid.svelte";
import ArrayNode from "./array.svelte";
import BasicField from "./basic-field.svelte";

type NodeComponent<T extends NodeType> = Component<NodeProps<T>, {}, "node">;

export const NODES: {
  [T in NodeType]?: NodeComponent<T>;
} = {
  [NodeType.Object]: ObjectNode,
  [NodeType.ObjectProperty]: ObjectPropertyNode,
  [NodeType.ObjectPropertyDependency]: ObjectPropertyDependencyNode,
  [NodeType.Predicate]: Predicate,
  [NodeType.Operator]: OperatorNode,
  [NodeType.Array]: ArrayNode,
  [NodeType.Grid]: GridNode,
  [NodeType.Enum]: EnumNode,
  [NodeType.MultiEnum]: EnumNode,
  [NodeType.String]: BasicField,
  [NodeType.Number]: BasicField,
  [NodeType.Boolean]: BasicField,
  [NodeType.File]: BasicField,
  [NodeType.Tags]: BasicField,
} satisfies {
  [T in CustomizableNodeType]: NodeComponent<T>;
} & {
  [T in NodeType]?: NodeComponent<T>;
};
