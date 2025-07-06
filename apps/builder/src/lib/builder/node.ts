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
  MultiEnum = "multi-enum",
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
  value: string;
}
export interface InOperator extends AbstractOperator<OperatorType.In> {
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

export type ContainsOperator = AbstractOperators[OperatorType.Contains];

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

export const OBJECT_NODE_OPTIONS_SCHEMA = {
  title: "Group options",
  type: "object",
  properties: {},
  additionalProperties: false,
} as const satisfies Schema;

export type ObjectOptions = FromSchema<typeof OBJECT_NODE_OPTIONS_SCHEMA>;

export interface ObjectNode
  extends AbstractCustomizableNode<NodeType.Object, ObjectOptions> {
  properties: ObjectPropertyNode[];
}

export const ARRAY_NODE_OPTIONS_SCHEMA = {
  title: "List options",
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
    uniqueItems: {
      title: "Unique items",
      type: "boolean",
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

export const ENUM_OPTIONS_SCHEMA = {
  title: "Choice options",
  type: "object",
  properties: {
    widget: {
      title: "Widget",
      type: "string",
    },
    defaultValue: {
      title: "Default value",
      type: "string",
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type EnumOptions = FromSchema<typeof ENUM_OPTIONS_SCHEMA>;

export interface EnumNode
  extends AbstractCustomizableNode<NodeType.Enum, EnumOptions> {
  valueType: EnumValueType;
  items: EnumItemNode[];
}

export const MULTI_ENUM_OPTIONS_SCHEMA = {
  title: "Multi choice options",
  type: "object",
  properties: {
    widget: {
      title: "Widget",
      type: "string",
    },
    defaultValue: {
      title: "Default value",
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
      },
    },
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

export type MultiEnumOptions = FromSchema<typeof MULTI_ENUM_OPTIONS_SCHEMA>;

export interface MultiEnumNode
  extends AbstractCustomizableNode<NodeType.MultiEnum, MultiEnumOptions> {
  valueType: EnumValueType;
  items: EnumItemNode[];
}

export const STRING_NODE_OPTIONS_SCHEMA = {
  type: "object",
  title: "String options",
  properties: {
    widget: {
      title: "Widget",
      type: "string",
    },
    defaultValue: {
      title: "Default value",
      type: "string",
    },
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

export const NUMBER_NODE_OPTIONS_SCHEMA = {
  title: "Number options",
  type: "object",
  properties: {
    widget: {
      title: "Widget",
      type: "string",
    },
    defaultValue: {
      title: "Default value",
      type: "number",
    },
    minimum: {
      title: "Minimum",
      type: "number",
    },
    maximum: {
      title: "Maximum",
      type: "number",
    },
    multipleOf: {
      title: "Multiple of",
      type: "number",
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type NumberOptions = FromSchema<typeof NUMBER_NODE_OPTIONS_SCHEMA>;

export interface NumberNode
  extends AbstractCustomizableNode<NodeType.Number, NumberOptions> {}

export const BOOLEAN_NODE_OPTIONS_SCHEMA = {
  title: "Boolean options",
  type: "object",
  properties: {
    widget: {
      title: "Widget",
      type: "string",
    },
    defaultValue: {
      title: "Default value",
      type: "boolean",
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type BooleanOptions = FromSchema<typeof BOOLEAN_NODE_OPTIONS_SCHEMA>;

export interface BooleanNode
  extends AbstractCustomizableNode<NodeType.Boolean, BooleanOptions> {}

export type Node =
  | ObjectNode
  | ObjectPropertyNode
  | ObjectPropertyDependencyNode
  | ArrayNode
  | GridNode
  | EnumNode
  | MultiEnumNode
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
  [NodeType.Enum]: "Choice",
  [NodeType.MultiEnum]: "Multi choice",
  [NodeType.String]: "String",
  [NodeType.Number]: "Number",
  [NodeType.Boolean]: "Boolean",
};

export const CUSTOMIZABLE_TYPES = Object.keys(
  CUSTOMIZABLE_TYPE_TITLES
) as CustomizableNodeType[];

export const NODE_OPTIONS_SCHEMAS = {
  [NodeType.Object]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    OBJECT_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Array]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    ARRAY_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Grid]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    GRID_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Enum]: mergeSchemas(COMMON_OPTIONS_SCHEMA, ENUM_OPTIONS_SCHEMA),
  [NodeType.MultiEnum]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    MULTI_ENUM_OPTIONS_SCHEMA
  ),
  [NodeType.String]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    STRING_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Number]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    NUMBER_NODE_OPTIONS_SCHEMA
  ),
  [NodeType.Boolean]: mergeSchemas(
    COMMON_OPTIONS_SCHEMA,
    BOOLEAN_NODE_OPTIONS_SCHEMA
  ),
} satisfies Record<CustomizableNodeType, Schema>;

const COMMON_UI_SCHEMA: UiSchemaRoot = {
  description: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
  },
};

export const NODE_OPTIONS_UI_SCHEMAS = {
  [NodeType.Object]: COMMON_UI_SCHEMA,
  [NodeType.Array]: COMMON_UI_SCHEMA,
  [NodeType.Grid]: {
    ...COMMON_UI_SCHEMA,
    gap: {
      "ui:options": {
        shadcn4Text: {
          placeholder: "Input CSS unit",
        },
      },
    },
  },
  [NodeType.Enum]: {
    ...COMMON_UI_SCHEMA,
    "ui:options": {
      order: ["widget", "*"],
    },
    defaultValue: {
      "ui:options": {
        shadcn4Text: {
          placeholder: "Input JSON value",
        },
      },
    },
  },
  [NodeType.MultiEnum]: {
    ...COMMON_UI_SCHEMA,
    "ui:options": {
      order: ["widget", "*"],
    },
    defaultValue: {
      items: {
        "ui:options": {
          shadcn4Text: {
            placeholder: "Input JSON value",
          },
        },
      },
      "ui:options": {
        orderable: false,
      },
    },
  },
  [NodeType.String]: {
    ...COMMON_UI_SCHEMA,
    "ui:options": {
      order: ["widget", "*"],
    },
  },
  [NodeType.Number]: {
    ...COMMON_UI_SCHEMA,
    "ui:options": {
      order: ["widget", "*"],
    },
  },
  [NodeType.Boolean]: {
    ...COMMON_UI_SCHEMA,
    "ui:options": {
      order: ["widget", "*"],
    },
    defaultValue: {
      "ui:components": {
        booleanField: "booleanSelectField",
        selectWidget: "radioWidget",
      },
      "ui:options": {
        useLabel: false,
        // enumNames: ["true", "false"],
        shadcn4RadioGroup: {
          style: "display: flex;",
        },
      },
    },
  },
} satisfies Record<CustomizableNodeType, UiSchemaRoot>;
