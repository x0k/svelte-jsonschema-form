import { constant } from "$lib/function.js";

import { NodeType, type AbstractNode, type Node } from "./node.js";
import { OperatorType } from "./operator.js";
import { createNodeTraverser } from "./node-traverser.js";

const empty: OperatorType[] = [];
const emptyConstant = constant(empty);
const objectOperators = constant([
  OperatorType.HasProperty,
  OperatorType.Property,
]);
const multiEnumOperators = [
  OperatorType.MinItems,
  OperatorType.MaxItems,
];
const multiEnumOperatorsConstant = constant(multiEnumOperators);
const filesOperators = multiEnumOperators.concat(OperatorType.UniqueItems);
const arrayOperators = filesOperators.concat(OperatorType.Contains);
const NODE_TO_OPERATORS: {
  [T in NodeType]: (node: Extract<Node, AbstractNode<T>>) => OperatorType[];
} = {
  [NodeType.Object]: objectOperators,
  [NodeType.ObjectProperty]: emptyConstant,
  [NodeType.ObjectPropertyDependency]: emptyConstant,
  [NodeType.Predicate]: emptyConstant,
  [NodeType.Operator]: emptyConstant,
  [NodeType.Array]: constant(arrayOperators),
  [NodeType.Grid]: objectOperators,
  [NodeType.Enum]: emptyConstant,
  [NodeType.MultiEnum]: multiEnumOperatorsConstant,
  [NodeType.EnumItem]: emptyConstant,
  [NodeType.String]: constant([
    OperatorType.Pattern,
    OperatorType.MinLength,
    OperatorType.MaxLength,
  ]),
  [NodeType.Number]: constant([
    OperatorType.Less,
    OperatorType.LessOrEq,
    OperatorType.Greater,
    OperatorType.GreaterOrEq,
    OperatorType.MultipleOf,
  ]),
  [NodeType.Boolean]: emptyConstant,
  [NodeType.File]: (node) => (node.options.multiple ? filesOperators : empty),
  [NodeType.Tags]: multiEnumOperatorsConstant,
};

const COMMON_OPERATORS = new Set([
  OperatorType.And,
  OperatorType.Or,
  OperatorType.Xor,
  OperatorType.Not,
  OperatorType.Eq,
  OperatorType.In,
]);

const detectOperators = createNodeTraverser({
  *onEnter(node) {
    yield* NODE_TO_OPERATORS[node.type](node as never);
  },
});

export function detectApplicableOperators(node: Node) {
  const operators = new Set(COMMON_OPERATORS);
  for (const op of detectOperators(node)) {
    operators.add(op);
  }
  return operators;
}
