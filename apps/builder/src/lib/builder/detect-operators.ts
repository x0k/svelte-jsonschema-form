import { constant } from '$lib/function.js';

import { NodeType, type AbstractNode } from './node-base.js'
import type { Node } from './node.js';
import { OperatorType } from './operator.js';
import { createNodeTraverser } from './node-traverser.js';

const empty: OperatorType[] = [];
const noExtraOperators = constant(empty);
const objectOperators = constant([OperatorType.HasProperty, OperatorType.Property]);
const multiEnumOperators = [OperatorType.MinItems, OperatorType.MaxItems];
const multiEnumOperatorsConstant = constant(multiEnumOperators);
const filesOperators = multiEnumOperators.concat(OperatorType.UniqueItems);
const arrayOperators = filesOperators.concat(OperatorType.Contains);
const stringOperators = constant([
	OperatorType.Format,
	OperatorType.Pattern,
	OperatorType.MinLength,
	OperatorType.MaxLength
]);
const numberOperators = constant([
	OperatorType.Less,
	OperatorType.LessOrEq,
	OperatorType.Greater,
	OperatorType.GreaterOrEq,
	OperatorType.MultipleOf
]);
const NODE_TO_OPERATORS: {
	[T in NodeType]: (node: Extract<Node, AbstractNode<T>>) => OperatorType[];
} = {
	[NodeType.Object]: objectOperators,
	[NodeType.ObjectProperty]: noExtraOperators,
	[NodeType.ObjectPropertyDependency]: noExtraOperators,
	[NodeType.Predicate]: noExtraOperators,
	[NodeType.Operator]: noExtraOperators,
	[NodeType.Array]: constant(arrayOperators),
	[NodeType.Grid]: objectOperators,
	[NodeType.Enum]: noExtraOperators,
	[NodeType.MultiEnum]: multiEnumOperatorsConstant,
	[NodeType.EnumItem]: noExtraOperators,
	[NodeType.String]: stringOperators,
	[NodeType.Number]: numberOperators,
	[NodeType.Boolean]: noExtraOperators,
	[NodeType.File]: (node) => (node.options.multiple ? filesOperators : empty),
	[NodeType.Tags]: multiEnumOperatorsConstant,
	[NodeType.Range]: objectOperators
};

const COMMON_OPERATORS = new Set([
	OperatorType.And,
	OperatorType.Or,
	OperatorType.Xor,
	OperatorType.Not,
	OperatorType.Eq,
	OperatorType.In
]);

const detectOperators = createNodeTraverser({
	*onEnter(node) {
		yield NODE_TO_OPERATORS[node.type](node as never);
	}
});

export function detectApplicableOperators(node: Node, current = false) {
	const operators = new Set(COMMON_OPERATORS);
	for (const ops of detectOperators(node)) {
		for (const op of ops) {
			operators.add(op);
		}
		if (current) {
			break;
		}
	}
	return operators;
}
