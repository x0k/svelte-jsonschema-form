import type { Brand } from "@sjsf/form/lib/types";
import { mergeSchemas } from "@sjsf/form/core";
import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

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

export enum OperatorType {
  And = "and",
  Or = "or",
  Xor = "xor",
  Not = "not",
  Eq = "eq",
  In = "in",
  Less = "less",
  LessOrEq = "lessOrEq",
  Greater = "greater",
  GreaterOrEq = "greaterOrEq",
  MultipleOf = "multipleOf",
  MinLength = "minLength",
  MaxLength = "maxLength",
  Pattern = "pattern",
}

export interface AbstractOperator<T extends OperatorType> {
  op: T;
}

export interface AbstractNOperator<T extends OperatorType>
  extends AbstractOperator<T> {
  operands: OperatorNode[];
}

export type Comparator =
  | OperatorType.Greater
  | OperatorType.GreaterOrEq
  | OperatorType.Less
  | OperatorType.LessOrEq
  | OperatorType.MultipleOf
  | OperatorType.MinLength
  | OperatorType.MaxLength;

export interface AbstractComparisonOperator<T extends Comparator>
  extends AbstractOperator<T> {
  value: number | undefined;
}

export type AndOperator = AbstractNOperator<OperatorType.And>;
export type OrOperator = AbstractNOperator<OperatorType.Or>;
export type XorOperator = AbstractNOperator<OperatorType.Xor>;
export interface NotOperator extends AbstractOperator<OperatorType.Not> {
  operand: OperatorNode | undefined;
}
export interface EqOperator extends AbstractOperator<OperatorType.Eq> {
  valueType: EnumValueType;
  value: string;
}
export interface InOperator extends AbstractOperator<OperatorType.In> {
  valueType: EnumValueType;
  values: string[];
}
export interface PatternOperator
  extends AbstractOperator<OperatorType.Pattern> {
  value: string;
}

export type Operator =
  | AndOperator
  | OrOperator
  | XorOperator
  | NotOperator
  | EqOperator
  | InOperator
  | PatternOperator
  | AbstractComparisonOperator<Comparator>;

export type NOperator = Extract<Operator, AbstractNOperator<OperatorType>>;

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
  | StringNode
  | PredicateNode
  | OperatorNode;

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

export function createOperatorNode(op: OperatorType): OperatorNode {
  const id = nodeId();
  const type: NodeType = NodeType.Operator;
  switch (op) {
    case OperatorType.And:
    case OperatorType.Or:
    case OperatorType.Xor:
      return {
        id,
        type,
        op,
        operands: [],
      };
    case OperatorType.Not:
      return {
        id,
        type,
        op,
        operand: undefined,
      };
    case OperatorType.Eq:
      return {
        id,
        type,
        op,
        value: "",
        valueType: EnumValueType.String,
      };
    case OperatorType.In:
      return {
        id,
        type,
        op,
        valueType: EnumValueType.String,
        values: [],
      };
    case OperatorType.Pattern:
      return {
        id,
        type,
        op,
        value: "",
      };
    default:
      return {
        id,
        type,
        op,
        value: undefined,
      };
  }
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

export function createPredicate(): PredicateNode {
  return {
    id: nodeId(),
    type: NodeType.Predicate,
    operator: undefined,
  };
}

export function createObjectPropertyDependency(): ObjectPropertyDependencyNode {
  return {
    id: nodeId(),
    type: NodeType.ObjectPropertyDependency,
    predicate: createPredicate(),
    properties: [],
  };
}

export function nodeSchema(node: CustomizableNode): Schema {
  return NODE_OPTIONS_SCHEMAS[node.type];
}

export function nodeUiSchema(node: CustomizableNode): UiSchemaRoot {
  return NODE_OPTIONS_UI_SCHEMAS[node.type];
}
const N_OPERATORS = new Set<OperatorType>([
  OperatorType.And,
  OperatorType.Or,
  OperatorType.Xor,
]);

export function isNOperator(operator: Operator): operator is NOperator {
  return N_OPERATORS.has(operator.op);
}
