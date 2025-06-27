import type { Brand } from "@sjsf/form/lib/types";
import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";
import { mergeSchemas } from "@sjsf/form/core";

export enum NodeType {
  Object = "object",
  String = "string",
  Grid = "grid",
}

export type NodeId = Brand<"node-id">;

export const COMMON_OPTIONS_SCHEMA = {
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
    },
    description: {
      title: "Description",
      type: "string",
    },
    required: {
      type: "boolean",
    },
  },
  required: ["title", "required"],
  additionalProperties: false,
} as const satisfies Schema;

export type CommonOptions = FromSchema<typeof COMMON_OPTIONS_SCHEMA>;

export interface AbstractNode<T extends NodeType, O extends {}> {
  id: NodeId;
  type: T;
  options: CommonOptions & O;
}

export interface ObjectNode extends AbstractNode<NodeType.Object, {}> {
  children: Node[];
}

export interface GridCell {
  x: number;
  y: number;
  w: number;
  h: number;
  node: Node;
}

export const GRID_NODE_OPTIONS_SCHEMA = {
  title: "Grid settings",
  type: "object",
  properties: {
    width: {
      title: "Columns",
      type: "number",
      minimum: 1,
    },
    height: {
      title: "Rows",
      type: "number",
      minimum: 1,
    },
  },
  required: ["width", "height"],
  additionalProperties: false,
} as const satisfies Schema;

export type GridNodeOptions = FromSchema<typeof GRID_NODE_OPTIONS_SCHEMA>;

export interface GridNode extends AbstractNode<NodeType.Grid, {}> {
  width: number;
  height: number;
  cells: GridCell[];
}

export interface TextNode extends AbstractNode<NodeType.String, {}> {}

export type Node = ObjectNode | GridNode | TextNode;

const NODE_FACTORIES = {
  [NodeType.Object]: (id) => ({
    id,
    type: NodeType.Object,
    children: [],
    options: {
      title: "Group title",
      required: true,
    },
  }),
  [NodeType.Grid]: (id) => ({
    id,
    type: NodeType.Grid,
    cells: [],
    width: 3,
    height: 4,
    options: {
      title: "Grid title",
      required: true,
    },
  }),
  [NodeType.String]: (id) => ({
    id,
    type: NodeType.String,
    options: {
      title: "Text field",
      required: true,
    },
  }),
} satisfies {
  [T in NodeType]: (id: NodeId) => Extract<Node, AbstractNode<T, any>>;
};

const NODE_OPTIONS_SCHEMAS = {
  [NodeType.Object]: {
    title: "Group settings",
  },
  [NodeType.Grid]: {
    title: "Grid settings",
  },
  [NodeType.String]: {
    title: "String settings",
  },
} satisfies Record<NodeType, Schema>;

const NODE_OPTIONS_UI_SCHEMAS = {
  [NodeType.Object]: {},
  [NodeType.Grid]: {
    width: {
      "ui:components": {
        numberWidget: "myStepperWidget",
      },
    },
    height: {
      "ui:components": {
        numberWidget: "myStepperWidget",
      },
    },
  },
  [NodeType.String]: {},
} satisfies Record<NodeType, UiSchemaRoot>;

export function nodeId(): NodeId {
  return crypto.randomUUID() as NodeId;
}

export function createNode(type: NodeType): Node {
  return NODE_FACTORIES[type](nodeId());
}

export function nodeSchema(type: NodeType): Schema {
  return mergeSchemas(COMMON_OPTIONS_SCHEMA, NODE_OPTIONS_SCHEMAS[type]);
}

export function nodeUiSchema(type: NodeType): UiSchemaRoot {
  return NODE_OPTIONS_UI_SCHEMAS[type];
}
