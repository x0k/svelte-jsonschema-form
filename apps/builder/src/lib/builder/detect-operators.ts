import { NodeType, type AbstractNode, type Node } from "./node.js";
import { OperatorType } from "./operator.js";
import { createNodeTraverser } from "./node-traverser.js";

const empty: OperatorType[] = [];
const objectOperators = [OperatorType.HasProperty, OperatorType.Property];
const multiEnumOperators = [
  OperatorType.Contains,
  OperatorType.MinItems,
  OperatorType.MaxItems,
];
const arrayOperators = multiEnumOperators.concat(OperatorType.UniqueItems);
const filesOperators = arrayOperators.filter(
  (t) => t !== OperatorType.Contains
);
const NODE_TO_OPERATORS: {
  [T in NodeType]: (node: Extract<Node, AbstractNode<T>>) => OperatorType[];
} = {
  [NodeType.Object]: () => [OperatorType.HasProperty, OperatorType.Property],
  [NodeType.ObjectProperty]: () => empty,
  [NodeType.ObjectPropertyDependency]: () => empty,
  [NodeType.Predicate]: () => empty,
  [NodeType.Operator]: () => empty,
  [NodeType.Array]: () => arrayOperators,
  [NodeType.Grid]: () => objectOperators,
  [NodeType.Enum]: () => empty,
  [NodeType.MultiEnum]: () => multiEnumOperators,
  [NodeType.EnumItem]: () => empty,
  [NodeType.String]: () => [
    OperatorType.Pattern,
    OperatorType.MinLength,
    OperatorType.MaxLength,
  ],
  [NodeType.Number]: () => [
    OperatorType.Less,
    OperatorType.LessOrEq,
    OperatorType.Greater,
    OperatorType.GreaterOrEq,
    OperatorType.MultipleOf,
  ],
  [NodeType.Boolean]: () => empty,
  [NodeType.File]: (node) => (node.options.multiple ? filesOperators : empty),
  [NodeType.Tags]: () => multiEnumOperators,
};

const COMMON_OPERATORS = [
  OperatorType.And,
  OperatorType.Or,
  OperatorType.Xor,
  OperatorType.Not,
  OperatorType.Eq,
  OperatorType.In,
];

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
