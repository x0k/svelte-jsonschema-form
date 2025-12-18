import { NodeType, type AbstractNode } from './node-base.js';
import {
	type Node,
	type ComparisonOperator,
	type CustomizableNode,
	type NOperator,
	type ObjectPropertyNode,
	type Operator,
	type OperatorNode,
	type SOperator,
	type UOperator,
	CUSTOMIZABLE_TYPE_TITLES
} from './node.js';
import {
	U_OPERATORS_SET,
	N_OPERATORS_SET,
	S_OPERATORS_SET,
	COMPARISON_OPERATORS_SET,
	OperatorType,
	type AbstractOperator
} from './operator.js';

export function isUOperator(node: Operator): node is UOperator {
	return U_OPERATORS_SET.has(node.op);
}

export function isNOperator(operator: Operator): operator is NOperator {
	return N_OPERATORS_SET.has(operator.op);
}

export function isSOperator(node: Operator): node is SOperator {
	return S_OPERATORS_SET.has(node.op);
}

export function isComparisonOperator(node: Operator): node is ComparisonOperator {
	return COMPARISON_OPERATORS_SET.has(node.op);
}

const createOperatorGuard =
	<T extends OperatorType>(type: T) =>
	(node: OperatorNode): node is Extract<OperatorNode, AbstractOperator<T>> =>
		node.op === type;

export const isEqOperator = createOperatorGuard(OperatorType.Eq);

export const isInOperator = createOperatorGuard(OperatorType.In);

export const isPatternOperator = createOperatorGuard(OperatorType.Pattern);

export const isContainsOperator = createOperatorGuard(OperatorType.Contains);

export const isUniqueItemsOperator = createOperatorGuard(OperatorType.UniqueItems);

export const isPropertyOperator = createOperatorGuard(OperatorType.Property);

export const isHasPropertyOperator = createOperatorGuard(OperatorType.HasProperty);

export const isCustomizableNode = (node: Node): node is CustomizableNode =>
	node.type in CUSTOMIZABLE_TYPE_TITLES;

const createNodeGuard =
	<T extends NodeType>(type: T) =>
	(node: Node): node is Extract<Node, AbstractNode<T>> =>
		node.type === type;

export const isObjectNode = createNodeGuard(NodeType.Object);

export const isArrayNode = createNodeGuard(NodeType.Array);

export const isGridNode = createNodeGuard(NodeType.Grid);

export const isPredicateNode = createNodeGuard(NodeType.Predicate);

export const isOperatorNode = createNodeGuard(NodeType.Operator);

export const isObjectPropertyNode = createNodeGuard(NodeType.ObjectProperty);

export const isObjectPropertyDependencyNode = createNodeGuard(NodeType.ObjectPropertyDependency);

export const isCustomizableOrPropertyNode = (
	node: Node
): node is CustomizableNode | ObjectPropertyNode =>
	isCustomizableNode(node) || isObjectPropertyNode(node);

export const isEnumItemNode = createNodeGuard(NodeType.EnumItem);

export const isEnumNode = createNodeGuard(NodeType.Enum);

export const isMultiEnumNode = createNodeGuard(NodeType.MultiEnum);

export const isStringNode = createNodeGuard(NodeType.String);

export const isNumberNode = createNodeGuard(NodeType.Number);

export const isBooleanNode = createNodeGuard(NodeType.Boolean);

export const isFileNode = createNodeGuard(NodeType.File);

export const isTagsNode = createNodeGuard(NodeType.Tags);

export const isRangeNode = createNodeGuard(NodeType.Range);
