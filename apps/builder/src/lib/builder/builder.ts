import type { Brand } from "@sjsf/form/lib/types";
import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";
import { mergeSchemas } from "@sjsf/form/core";

export enum NodeType {
  Object = "object",
  ObjectProperty = "object-property",
  ObjectPropertyDependency = "object-property-dependency",
  Array = "array",
  Grid = "grid",
  Enum = "enum",
  EnumItem = "enum-item",
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

export interface AbstractNode<T extends NodeType> {
  id: NodeId;
  type: T;
}

export interface AbstractCustomizableNode<T extends NodeType, O extends {}>
  extends AbstractNode<T> {
  options: CommonOptions & O;
}

export interface ObjectPropertyDependencyNode
  extends AbstractNode<NodeType.ObjectPropertyDependency> {
  predicate: Node | undefined;
  properties: Node[];
}

export interface ObjectPropertyNode
  extends AbstractNode<NodeType.ObjectProperty> {
  property: Node;
  complementary: NodeId | undefined;
  dependencies: ObjectPropertyDependencyNode[];
}

export interface ObjectNode
  extends AbstractCustomizableNode<NodeType.Object, {}> {
  properties: ObjectPropertyNode[];
}

export const ARRAY_NODE_OPTIONS_SCHEMA = {
  title: "Array options",
  type: "object",
  properties: {
    minItems: {
      title: "Min items",
      type: "number",
    },
    maxItems: {
      title: "Max items",
      type: "number",
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type ArrayNodeOptions = FromSchema<typeof ARRAY_NODE_OPTIONS_SCHEMA>;

export interface ArrayNode
  extends AbstractCustomizableNode<NodeType.Array, ArrayNodeOptions> {
  item: Node | undefined;
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

export interface GridNode
  extends AbstractCustomizableNode<NodeType.Grid, GridNodeOptions> {
  width: number;
  height: number;
  cells: GridCell[];
}

export enum EnumValueType {
  String = "string",
  JSON = "json",
}

export const ENUM_VALUE_TYPE_TITLES: Record<EnumValueType, string> = {
  [EnumValueType.String]: "String",
  [EnumValueType.JSON]: "JSON",
};

export const ENUM_VALUE_TYPES = Object.values(EnumValueType);

export interface EnumItemNode extends AbstractNode<NodeType.EnumItem> {
  label: string;
  value: string;
}

export interface EnumNode extends AbstractCustomizableNode<NodeType.Enum, {}> {
  valueType: EnumValueType;
  items: EnumItemNode[];
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
  extends AbstractCustomizableNode<NodeType.String, StringNodeOptions> {}

export type Node =
  | ObjectNode
  | ObjectPropertyNode
  | ObjectPropertyDependencyNode
  | ArrayNode
  | GridNode
  | EnumNode
  | EnumItemNode
  | StringNode;

export type CustomizableNode = Extract<
  Node,
  AbstractCustomizableNode<NodeType, any>
>;

export type CustomizableNodeType = CustomizableNode["type"];

const NODE_FACTORIES = {
  [NodeType.Object]: (id) => ({
    id,
    type: NodeType.Object,
    properties: [],
    dependencies: {},
    options: {
      title: "Group title",
      required: true,
    },
  }),
  [NodeType.Array]: (id) => ({
    id,
    type: NodeType.Array,
    item: undefined,
    options: {
      title: "List title",
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
        type: NodeType.EnumItem,
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
} as const satisfies {
  [T in CustomizableNode["type"]]: (
    id: NodeId
  ) => Extract<Node, AbstractNode<T>>;
};

const NODE_OPTIONS_SCHEMAS = {
  [NodeType.Object]: mergeSchemas(COMMON_OPTIONS_SCHEMA, {
    title: "Group options",
  }),
  [NodeType.Array]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    ARRAY_NODE_OPTIONS_SCHEMA
  ),
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
} satisfies Record<CustomizableNodeType, Schema>;

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
  [NodeType.Array]: {
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
} satisfies Record<CustomizableNodeType, UiSchemaRoot>;

function nodeId(): NodeId {
  return crypto.randomUUID() as NodeId;
}

export function isCustomizableNodeType(
  type: NodeType
): type is CustomizableNodeType {
  return type in NODE_FACTORIES;
}

export function createNode(type: CustomizableNodeType): CustomizableNode {
  return NODE_FACTORIES[type](nodeId());
}

export function createEnumItemNode(label: string, value: string): EnumItemNode {
  return {
    id: nodeId(),
    type: NodeType.EnumItem,
    label,
    value,
  };
}

export function createObjectProperty(
  property: CustomizableNode
): ObjectPropertyNode {
  return {
    id: nodeId(),
    type: NodeType.ObjectProperty,
    property,
    complementary: undefined,
    dependencies: [],
  };
}

export function createObjectPropertyDependency(): ObjectPropertyDependencyNode {
  return {
    id: nodeId(),
    type: NodeType.ObjectPropertyDependency,
    predicate: undefined,
    properties: [],
  };
}

export function nodeSchema(node: CustomizableNode): Schema {
  return NODE_OPTIONS_SCHEMAS[node.type];
}

export function nodeUiSchema(node: CustomizableNode): UiSchemaRoot {
  return NODE_OPTIONS_UI_SCHEMAS[node.type];
}
