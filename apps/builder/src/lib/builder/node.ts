import type { Brand } from "@sjsf/form/lib/types";
import { mergeSchemas } from "@sjsf/form/core";
import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

import { isValidRegExp } from "$lib/reg-exp.js";

import {
  COMPARISON_OPERATORS_SET,
  N_OPERATORS_SET,
  OperatorType,
  S_OPERATORS_SET,
  U_OPERATORS_SET,
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

export const CUSTOMIZABLE_TYPE_TITLES: Record<CustomizableNodeType, string> = {
  [NodeType.Object]: "Group",
  [NodeType.Array]: "List",
  [NodeType.Grid]: "Grid",
  [NodeType.Enum]: "Enum",
  [NodeType.String]: "String",
};

export const CUSTOMIZABLE_TYPES = Object.keys(
  CUSTOMIZABLE_TYPE_TITLES
) as CustomizableNodeType[];

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
    case OperatorType.Contains:
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
    case OperatorType.HasProperty:
    case OperatorType.Pattern:
      return {
        id,
        type,
        op,
        value: "",
      };
    case OperatorType.UniqueItems: {
      return {
        id,
        type,
        op,
      };
    }
    case OperatorType.Property: {
      return {
        id,
        type,
        op,
        propertyId: undefined,
        operator: undefined,
      };
    }
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

export function isUOperator(node: Operator): node is UOperator {
  return U_OPERATORS_SET.has(node.op);
}

export function isNOperator(operator: Operator): operator is NOperator {
  return N_OPERATORS_SET.has(operator.op);
}

export function isSOperator(node: Operator): node is SOperator {
  return S_OPERATORS_SET.has(node.op);
}

export function isComparisonOperator(
  node: Operator
): node is ComparisonOperator {
  return COMPARISON_OPERATORS_SET.has(node.op);
}

const createOperatorGuard =
  <T extends OperatorType>(type: T) =>
  (node: OperatorNode): node is Extract<OperatorNode, AbstractOperator<T>> =>
    node.op === type;

export const isEqOperator = createOperatorGuard(OperatorType.Eq);

export const isInOperator = createOperatorGuard(OperatorType.In);

export const isUniqueItemsOperator = createOperatorGuard(
  OperatorType.UniqueItems
);

export const isPropertyOperator = createOperatorGuard(OperatorType.Property);

export type StringifiedOperator = { ok: boolean; value: string };

export function stringifyOperator(
  operator: Operator,
  node: Node | undefined
): StringifiedOperator {
  switch (operator.op) {
    case OperatorType.And:
    case OperatorType.Or:
    case OperatorType.Xor: {
      if (operator.operands.length === 0) {
        return { ok: false, value: `${operator.op}(<no args>)` };
      }
      let ok = true;
      const values: string[] = [];
      for (const operand of operator.operands) {
        const r = stringifyOperator(operand, node);
        ok &&= r.ok;
        values.push(r.value);
      }
      return {
        ok,
        value: `${operator.op}(${values.join(", ")})`,
      };
    }
    case OperatorType.Contains:
    case OperatorType.Not: {
      if (operator.operand === undefined) {
        return {
          ok: false,
          value: `not(<undefined>)`,
        };
      }
      const r = stringifyOperator(operator.operand, node);
      return {
        ok: r.ok,
        value: `${operator.op}(${r.value})`,
      };
    }
    case OperatorType.Eq: {
      return {
        ok: true,
        value: `eq(${operator.valueType === EnumValueType.JSON ? operator.value : JSON.stringify(operator.value)})`,
      };
    }
    case OperatorType.In: {
      const haveItems = operator.values.length > 0;
      return {
        ok: haveItems,
        value: `in(${
          haveItems
            ? (operator.valueType === EnumValueType.JSON
                ? operator.values
                : operator.values.map((v) => JSON.stringify(v))
              ).join(", ")
            : "<no values>"
        })`,
      };
    }
    case OperatorType.HasProperty:
    case OperatorType.Pattern: {
      const ok =
        operator.op !== OperatorType.Pattern || isValidRegExp(operator.value);
      return {
        ok,
        value: `${operator.op}(${ok ? operator.value : "<invalid value>"})`,
      };
    }
    case OperatorType.UniqueItems: {
      return {
        ok: true,
        value: operator.op,
      };
    }
    case OperatorType.Property: {
      const prop =
        node &&
        isObjectNode(node) &&
        node.properties.find((p) => p.id === operator.propertyId)?.property;
      const r =
        operator.operator &&
        stringifyOperator(operator.operator, prop || undefined);
      const propTitle = (prop && getNodeTitle(prop)) ?? operator.propertyId;
      return {
        ok: r?.ok === true,
        value: `property(${propTitle ? `"${propTitle}"` : "<undefined>"}, ${r?.value ?? "<undefined>"})`,
      };
    }
    default: {
      const ok = operator.value !== undefined;
      return {
        ok,
        value: `${operator.op}(${ok ? operator.value : "<undefined>"})`,
      };
    }
  }
}

export const isCustomizableNode = (node: Node): node is CustomizableNode =>
  isCustomizableNodeType(node.type);

const createNodeGuard =
  <T extends NodeType>(type: T) =>
  (node: Node): node is Extract<Node, AbstractNode<T>> =>
    node.type === type;

export const isObjectNode = createNodeGuard(NodeType.Object);

export const isPredicateNode = createNodeGuard(NodeType.Predicate);

export const isOperatorNode = createNodeGuard(NodeType.Operator);

export const isObjectPropertyNode = createNodeGuard(NodeType.ObjectProperty);

export const isObjectPropertyDependencyNode = createNodeGuard(
  NodeType.ObjectPropertyDependency
);

export const isCustomizableOrPropertyNode = (
  node: Node
): node is CustomizableNode | ObjectPropertyNode =>
  isCustomizableNode(node) || isObjectPropertyNode(node);

export const isEnumItemNode = createNodeGuard(NodeType.EnumItem);

export function getNodeTitle(node: Node): string | undefined {
  return isCustomizableNode(node) ? node.options.title : undefined;
}

export function getNodeProperties(node: Node): Map<NodeId, string> {
  const map = new Map<NodeId, string>();
  if (node.type === NodeType.Object) {
    for (let i = 0; i < node.properties.length; i++) {
      const { id, property } = node.properties[i];
      map.set(id, getNodeTitle(property) ?? `Property ${i + 1}`);
    }
  }
  return map;
}
