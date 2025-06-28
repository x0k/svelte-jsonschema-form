import type { Brand, JsonPaths } from "@sjsf/form/lib/types";
import type { Schema, SchemaValue, UiSchemaRoot } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";
import { mergeSchemas } from "@sjsf/form/core";

export enum NodeType {
  Object = "object",
  Grid = "grid",
  Enum = "enum",
  String = "string",
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
      title: "Required",
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
  title: "Grid options",
  type: "object",
  properties: {
    gap: {
      title: "Gap",
      type: "string",
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type GridNodeOptions = FromSchema<typeof GRID_NODE_OPTIONS_SCHEMA>;

export interface GridNode extends AbstractNode<NodeType.Grid, GridNodeOptions> {
  width: number;
  height: number;
  cells: GridCell[];
}

export enum EnumValueType {
  String = "string",
  Number = "number",
  JSON = "json",
}

export const ENUM_VALUE_TYPE_TITLES: Record<EnumValueType, string> = {
  [EnumValueType.String]: "String",
  [EnumValueType.Number]: "Number",
  [EnumValueType.JSON]: "JSON",
};

export const ENUM_VALUE_TYPES = Object.values(EnumValueType);

export interface EnumItem {
  id: string;
  label: string;
  value: string;
}

export interface EnumNode extends AbstractNode<NodeType.Enum, {}> {
  valueType: EnumValueType;
  items: EnumItem[];
}

export const STRING_NODE_OPTIONS_SCHEMA = {
  type: "object",
  title: "String options",
  properties: {
    maxLength: {
      title: "Max length",
      type: "number",
      minimum: 0,
    },
    minLength: {
      title: "Min length",
      type: "number",
      minimum: 0,
    },
    pattern: {
      title: "Pattern",
      type: "string",
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type StringNodeOptions = FromSchema<typeof STRING_NODE_OPTIONS_SCHEMA>;

export interface StringNode
  extends AbstractNode<NodeType.String, StringNodeOptions> {}

export type Node = ObjectNode | GridNode | EnumNode | StringNode;

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
  [NodeType.Enum]: (id) => ({
    id,
    type: NodeType.Enum,
    valueType: EnumValueType.String,
    items: [
      {
        id: nodeId(),
        label: "foo",
        value: "bar",
      },
    ],
    options: {
      title: "Enum field",
      required: true,
    },
  }),
  [NodeType.String]: (id) => ({
    id,
    type: NodeType.String,
    options: {
      title: "String field",
      required: true,
    },
  }),
} satisfies {
  [T in NodeType]: (id: NodeId) => Extract<Node, AbstractNode<T, any>>;
};

const NODE_OPTIONS_SCHEMAS = {
  [NodeType.Object]: mergeSchemas(COMMON_OPTIONS_SCHEMA, {
    title: "Group options",
  }),
  [NodeType.Grid]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    GRID_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Enum]: mergeSchemas(COMMON_OPTIONS_SCHEMA, {
    title: "Enum options",
  }),
  [NodeType.String]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    STRING_NODE_OPTIONS_SCHEMA
  ),
} satisfies Record<NodeType, Schema>;

const COMMON_UI_SCHEMA: UiSchemaRoot = {
  description: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
  },
};

const NODE_OPTIONS_UI_SCHEMAS = {
  [NodeType.Object]: {
    ...COMMON_UI_SCHEMA,
  },
  [NodeType.Grid]: {
    ...COMMON_UI_SCHEMA,
  },
  [NodeType.Enum]: {
    ...COMMON_UI_SCHEMA,
  },
  [NodeType.String]: {
    ...COMMON_UI_SCHEMA,
  },
} satisfies Record<NodeType, UiSchemaRoot>;

export function nodeId(): NodeId {
  return crypto.randomUUID() as NodeId;
}

export function createNode(type: NodeType): Node {
  return NODE_FACTORIES[type](nodeId());
}

export function nodeSchema(node: Node): Schema {
  return NODE_OPTIONS_SCHEMAS[node.type];
}

export function nodeUiSchema(node: Node): UiSchemaRoot {
  return NODE_OPTIONS_UI_SCHEMAS[node.type];
}
