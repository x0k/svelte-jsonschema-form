import { EnumValueType } from './enum.js';
import { NodeType, type AbstractNode, type NodeId } from './node-base.js';
import {
	type Node,
	type CustomizableNode,
	type CustomizableNodeType,
	type EnumItemNode,
	type ObjectPropertyDependencyNode,
	type ObjectPropertyNode,
	type OperatorNode,
	type PredicateNode,
	MULTI_ENUM_OPTIONS_SCHEMA,
	BOOLEAN_NODE_OPTIONS_SCHEMA,
	FILE_NODE_OPTIONS_SCHEMA,
	TAGS_NODE_OPTIONS_SCHEMA
} from './node.js';
import { NUMBER_NODE_OPTIONS_SCHEMA } from './number-node.js';
import { OperatorType } from './operator.js';
import { createRangeNode, RANGE_NODE_OPTIONS_SCHEMA, RangeValueType } from './range-node.js';
import { STRING_NODE_OPTIONS_SCHEMA } from './string-node.js';

function nodeId(): NodeId {
	return crypto.randomUUID() as NodeId;
}

const NODE_FACTORIES: {
	[T in CustomizableNodeType]: (id: NodeId) => Extract<Node, AbstractNode<T>>;
} = {
	[NodeType.Object]: (id) => ({
		id,
		type: NodeType.Object,
		properties: [],
		options: {
			title: 'Group title',
			required: true
		}
	}),
	[NodeType.Array]: (id) => ({
		id,
		type: NodeType.Array,
		item: undefined,
		options: {
			title: 'List title',
			required: true
		}
	}),
	[NodeType.Grid]: (id) => ({
		id,
		type: NodeType.Grid,
		cells: [],
		width: 3,
		height: 4,
		options: {
			title: 'Grid title',
			required: true,
			cellSize: 'auto',
			gap: '1rem',
			additionalStyles: 'align-items: center;'
		}
	}),
	[NodeType.Enum]: (id) => ({
		id,
		type: NodeType.Enum,
		valueType: EnumValueType.String,
		items: [],
		options: {
			title: 'Choice field',
			required: true,
			widget: 'radioWidget'
		}
	}),
	[NodeType.MultiEnum]: (id) => ({
		id,
		type: NodeType.MultiEnum,
		valueType: EnumValueType.String,
		items: [],
		options: {
			title: 'Multi choice field',
			required: true,
			widget: MULTI_ENUM_OPTIONS_SCHEMA.properties.widget.default
		}
	}),
	[NodeType.String]: (id) => ({
		id,
		type: NodeType.String,
		options: {
			title: 'String field',
			required: true,
			widget: STRING_NODE_OPTIONS_SCHEMA.properties.widget.default
		}
	}),
	[NodeType.Number]: (id) => ({
		id,
		type: NodeType.Number,
		options: {
			title: 'Number field',
			required: true,
			widget: NUMBER_NODE_OPTIONS_SCHEMA.properties.widget.default
		}
	}),
	[NodeType.Boolean]: (id) => ({
		id,
		type: NodeType.Boolean,
		options: {
			title: 'Boolean field',
			required: true,
			widget: BOOLEAN_NODE_OPTIONS_SCHEMA.properties.widget.default
		}
	}),
	[NodeType.File]: (id) => ({
		id,
		type: NodeType.File,
		options: {
			title: 'File field',
			required: true,
			widget: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default
		}
	}),
	[NodeType.Tags]: (id) => ({
		id,
		type: NodeType.Tags,
		options: {
			title: 'Tags field',
			required: true,
			widget: TAGS_NODE_OPTIONS_SCHEMA.properties.widget.default
		}
	}),
	[NodeType.Range]: (id) =>
		createRangeNode(id, RangeValueType.String, {
			title: 'Range field',
			required: true,
			widget: RANGE_NODE_OPTIONS_SCHEMA.properties.widget.default
		})
};

export function createNode<T extends CustomizableNodeType>(
	type: T
): Extract<CustomizableNode, AbstractNode<T>> {
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
				operands: []
			};
		case OperatorType.Contains:
		case OperatorType.Not:
			return {
				id,
				type,
				op,
				operand: undefined
			};
		case OperatorType.Eq:
			return {
				id,
				type,
				op,
				value: ''
			};
		case OperatorType.In:
			return {
				id,
				type,
				op,
				values: []
			};
		case OperatorType.Format:
			return {
				id,
				type,
				op,
				value: ''
			};
		case OperatorType.Pattern:
			return {
				id,
				type,
				op,
				value: ''
			};
		case OperatorType.UniqueItems: {
			return {
				id,
				type,
				op
			};
		}
		case OperatorType.HasProperty: {
			return {
				id,
				type,
				op,
				propertyId: undefined
			};
		}
		case OperatorType.Property: {
			return {
				id,
				type,
				op,
				propertyId: undefined,
				operator: undefined
			};
		}
		default:
			return {
				id,
				type,
				op,
				value: undefined
			};
	}
}

export function createEnumItemNode(label: string, value: string): EnumItemNode {
	return {
		id: nodeId(),
		type: NodeType.EnumItem,
		label,
		value
	};
}

export function createObjectProperty(property: CustomizableNode): ObjectPropertyNode {
	return {
		id: nodeId(),
		type: NodeType.ObjectProperty,
		property,
		complementary: undefined,
		dependencies: []
	};
}

export function createPredicate(): PredicateNode {
	return {
		id: nodeId(),
		type: NodeType.Predicate,
		operator: undefined
	};
}

export function createObjectPropertyDependency(): ObjectPropertyDependencyNode {
	return {
		id: nodeId(),
		type: NodeType.ObjectPropertyDependency,
		predicate: createPredicate(),
		properties: []
	};
}
