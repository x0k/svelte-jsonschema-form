import { NodeType, type Node } from "./node.js";
import { OperatorType } from "./operator.js";
import { createNodeTraverser } from "./node-traverser.js";

const objectOperators = [OperatorType.HasProperty, OperatorType.Property];
const NODE_TO_OPERATORS: Record<NodeType, OperatorType[]> = {
  [NodeType.Object]: [OperatorType.HasProperty, OperatorType.Property],
  [NodeType.ObjectProperty]: [],
  [NodeType.ObjectPropertyDependency]: [],
  [NodeType.Predicate]: [],
  [NodeType.Operator]: [],
  [NodeType.Array]: [
    OperatorType.Contains,
    OperatorType.MinItems,
    OperatorType.MaxItems,
    OperatorType.UniqueItems,
  ],
  [NodeType.Grid]: objectOperators,
  [NodeType.Enum]: [],
  [NodeType.EnumItem]: [],
  [NodeType.String]: [
    OperatorType.Pattern,
    OperatorType.MinLength,
    OperatorType.MaxLength,
  ],
  [NodeType.Number]: [
    OperatorType.Less,
    OperatorType.LessOrEq,
    OperatorType.Greater,
    OperatorType.GreaterOrEq,
    OperatorType.MultipleOf,
  ],
  [NodeType.Boolean]: [],
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
    yield* NODE_TO_OPERATORS[node.type];
  },
});

export function detectApplicableOperators(node: Node) {
  const operators = new Set(COMMON_OPERATORS);
  for (const op of detectOperators(node)) {
    operators.add(op);
  }
  return operators;
}
