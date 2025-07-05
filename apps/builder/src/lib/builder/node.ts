import type { Brand } from "@sjsf/form/lib/types";
import { mergeSchemas } from "@sjsf/form/core";
import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

import {
  OperatorType,
  type AbstractOperator,
  type ComparatorOperatorType,
  type NOperatorType,
  type SOperatorType,
  type UOperatorType,
} from "./operator.js";
import { EnumValueType } from "./enum.js";

export enum NodeType {
  Object = "object",
  ObjectProperty = "object-property",
  ObjectPropertyDependency = "object-property-dependency",
  Predicate = "predicate",
  Operator = "operator",
  Array = "array",
  Grid = "grid",
  Enum = "enum",
  EnumItem = "enum-item",
  String = "string",
  Number = "number",
  Boolean = "boolean",
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

export interface PredicateNode extends AbstractNode<NodeType.Predicate> {
  operator: OperatorNode | undefined;
}

export interface ObjectPropertyDependencyNode
  extends AbstractNode<NodeType.ObjectPropertyDependency> {
  predicate: PredicateNode | undefined;
  properties: Node[];
}

export interface AbstractComparisonOperator<T extends ComparatorOperatorType>
  extends AbstractOperator<T> {
  value: number | undefined;
}

export interface AbstractUOperator<T extends UOperatorType>
  extends AbstractOperator<T> {
  operand: OperatorNode | undefined;
}

export interface AbstractNOperator<T extends NOperatorType>
  extends AbstractOperator<T> {
  operands: OperatorNode[];
}

export interface AbstractSOperator<T extends SOperatorType>
  extends AbstractOperator<T> {
  value: string;
}

export interface EqOperator extends AbstractOperator<OperatorType.Eq> {
  valueType: EnumValueType;
  value: string;
}
export interface InOperator extends AbstractOperator<OperatorType.In> {
  valueType: EnumValueType;
  values: string[];
}

export interface UniqueItemsOperator
  extends AbstractOperator<OperatorType.UniqueItems> {}

export interface PropertyOperator
  extends AbstractOperator<OperatorType.Property> {
  propertyId: NodeId | undefined;
  operator: OperatorNode | undefined;
}

export interface HasPropertyOperator
  extends AbstractOperator<OperatorType.HasProperty> {
  propertyId: NodeId | undefined;
}

type AbstractOperators = {
  [T in UOperatorType]: AbstractUOperator<T>;
} & {
  [T in NOperatorType]: AbstractNOperator<T>;
} & {
  [T in SOperatorType]: AbstractSOperator<T>;
};

export type UOperator = AbstractOperators[UOperatorType];

export type NOperator = AbstractOperators[NOperatorType];

export type SOperator = AbstractOperators[SOperatorType];

export type ComparisonOperator =
  AbstractComparisonOperator<ComparatorOperatorType>;

export type Operator =
  | EqOperator
  | InOperator
  | UniqueItemsOperator
  | UOperator
  | NOperator
  | SOperator
  | ComparisonOperator
  | HasPropertyOperator
  | PropertyOperator;

export type OperatorNode = AbstractNode<NodeType.Operator> & Operator;

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

export interface NumberNode
  extends AbstractCustomizableNode<NodeType.Number, {}> {}

export interface BooleanNode
  extends AbstractCustomizableNode<NodeType.Boolean, {}> {}

export type Node =
  | ObjectNode
  | ObjectPropertyNode
  | ObjectPropertyDependencyNode
  | ArrayNode
  | GridNode
  | EnumNode
  | EnumItemNode
  | StringNode
  | NumberNode
  | BooleanNode
  | PredicateNode
  | OperatorNode;

export type CustomizableNode = Extract<
  Node,
  AbstractCustomizableNode<NodeType, any>
>;

export type CustomizableNodeType = CustomizableNode["type"];

export const CUSTOMIZABLE_TYPE_TITLES: Record<CustomizableNodeType, string> = {
  [NodeType.Object]: "Group",
  [NodeType.Array]: "List",
  [NodeType.Grid]: "Grid",
  [NodeType.Enum]: "Enum",
  [NodeType.String]: "String",
  [NodeType.Number]: "Number",
  [NodeType.Boolean]: "Boolean",
};

export const CUSTOMIZABLE_TYPES = Object.keys(
  CUSTOMIZABLE_TYPE_TITLES
) as CustomizableNodeType[];

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
  [NodeType.Number]: mergeSchemas(COMMON_OPTIONS_SCHEMA, {
    title: "Number options",
  }),
  [NodeType.Boolean]: mergeSchemas(COMMON_OPTIONS_SCHEMA, {
    title: "Boolean options",
  }),
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
  [NodeType.Number]: {
    ...COMMON_UI_SCHEMA,
  },
  [NodeType.Boolean]: {
    ...COMMON_UI_SCHEMA,
  },
} satisfies Record<CustomizableNodeType, UiSchemaRoot>;

export function nodeSchema(node: CustomizableNode): Schema {
  return NODE_OPTIONS_SCHEMAS[node.type];
}

export function nodeUiSchema(node: CustomizableNode): UiSchemaRoot {
  return NODE_OPTIONS_UI_SCHEMAS[node.type];
}
