import { noop } from '@sjsf/form/lib/function';

import {
	isJsonValueArray,
	isJsonValueBoolean,
	isJsonValueNumber,
	isJsonValueObject,
	isJsonValueString,
	isValidJson
} from '$lib/json.js';
import { isValidRegExp } from '$lib/reg-exp.js';
import { isKnownJsonSchemaFormat } from '$lib/json-schema.js';

import { NodeType, type AbstractNode, type NodeId } from './node-base.js';
import { EnumValueType } from './enum.js';
import { OperatorType, type AbstractOperator } from './operator.js';
import {
	type ComparisonOperator,
	type CustomizableNode,
	type EnumNode,
	type MultiEnumNode,
	type Node,
	type NOperator,
	type Operator,
	type OperatorNode,
	type UOperator
} from './node.js';
import {
	isArrayNode,
	isBooleanNode,
	isCustomizableNode,
	isFileNode,
	isGridNode,
	isNumberNode,
	isObjectNode,
	isStringNode,
	isTagsNode
} from './node-guards.js';
import { getNodeChild, getNodeOptions, getNodeProperty } from './node-props.js';
import { RANGE_VALUE_TYPE_TITLES, type RangeValueType } from './range-node.js';

export interface ValidatorRegistries {
	complementary: NodeId | undefined;
	affectedNode: Node;
	enumValueType: EnumValueType;
}

export interface ValidatorContext {
	validateCustomizableNodeOptions: (node: CustomizableNode) => void;
	getAvailableRangeValueTypes(): RangeValueType[];
	addError: (node: Node, message: string) => void;
	addWarning: (node: Node, message: string) => void;
	push<K extends keyof ValidatorRegistries>(registry: K, value: ValidatorRegistries[K]): Disposable;
	peek<K extends keyof ValidatorRegistries>(registry: K): ValidatorRegistries[K] | undefined;
}

function checkAffected<R>(ctx: ValidatorContext, node: Node, check: (node: Node) => R) {
	const affected = ctx.peek('affectedNode');
	if (affected === undefined) {
		ctx.addError(node, 'It looks like you deleted the field to which this operator was applied');
	} else {
		return check(affected);
	}
}

enum ExpectedValueType {
	EnumMember = 'enum-member',
	JsonObject = 'json-object',
	JsonArray = 'json-array',
	JsonString = 'json-string',
	JsonNumber = 'json-number',
	Boolean = 'boolean'
}

const EXPECTED_VALUE_TYPE_ERRORS: Record<ExpectedValueType, string> = {
	[ExpectedValueType.EnumMember]: 'does not correspond to the possible field values',
	[ExpectedValueType.JsonObject]: 'should be a JSON object',
	[ExpectedValueType.JsonArray]: 'should be a JSON array',
	[ExpectedValueType.JsonString]: 'should be a JSON string',
	[ExpectedValueType.JsonNumber]: 'should be a JSON number',
	[ExpectedValueType.Boolean]: 'should be a boolean'
};

function createValueTypeCheckAgainstAffectedNode(ctx: ValidatorContext, node: Node) {
	return checkAffected(ctx, node, (affected) => {
		const options = getNodeOptions(affected);
		return (value: string) => {
			if (options.length > 0) {
				if (options.find((o) => o.value === value) === undefined) {
					return ExpectedValueType.EnumMember;
				}
			} else if (isObjectNode(affected) || isGridNode(affected)) {
				if (!isJsonValueObject(value)) {
					return ExpectedValueType.JsonObject;
				}
			} else if (isArrayNode(affected)) {
				if (!isJsonValueArray(value)) {
					return ExpectedValueType.JsonArray;
				}
			} else if (isStringNode(affected)) {
				if (!isJsonValueString(value)) {
					return ExpectedValueType.JsonString;
				}
			} else if (isNumberNode(affected)) {
				if (!isJsonValueNumber(value)) {
					return ExpectedValueType.JsonNumber;
				}
			} else if (isBooleanNode(affected)) {
				if (!isJsonValueBoolean(value)) {
					return ExpectedValueType.Boolean;
				}
			} else if (isFileNode(affected)) {
				if (affected.options.multiple) {
					if (!isJsonValueArray(value)) {
						return ExpectedValueType.JsonArray;
					}
				} else {
					if (!isJsonValueString(value)) {
						return ExpectedValueType.JsonString;
					}
				}
			} else if (isTagsNode(affected)) {
				if (!isJsonValueArray(value)) {
					return ExpectedValueType.JsonArray;
				}
			}
		};
	});
}

function validateNOperator(ctx: ValidatorContext, op: AbstractNode<NodeType.Operator> & NOperator) {
	if (op.operands.length === 0) {
		ctx.addError(op, 'Missing operands');
	} else if (op.operands.length === 1) {
		ctx.addWarning(op, 'An operator with one operand is redundant');
	}

	for (let i = 0; i < op.operands.length; i++) {
		validateOperator(ctx, op.operands[i]);
	}
}

function validateUOperator(ctx: ValidatorContext, op: AbstractNode<NodeType.Operator> & UOperator) {
	if (op.operand === undefined) {
		ctx.addError(op, 'Missing operand');
	} else {
		validateOperator(ctx, op.operand);
	}
}

function createComparisonOperatorValidator(
	customAffectedCheck: (
		ctx: ValidatorContext,
		op: AbstractNode<NodeType.Operator> & ComparisonOperator,
		affected: Node
	) => void
) {
	return (ctx: ValidatorContext, op: AbstractNode<NodeType.Operator> & ComparisonOperator) => {
		if (op.value === undefined) {
			ctx.addError(op, 'Missing value');
		} else {
			checkAffected(ctx, op, (affected) => {
				customAffectedCheck(ctx, op, affected);
			});
		}
	};
}

const validateStringComparisonOperator = createComparisonOperatorValidator((ctx, op, affected) => {
	if (!isStringNode(affected)) {
		ctx.addError(op, 'The operator can only be applied to string field');
	}
});

const validateNumberComparisonOperator = createComparisonOperatorValidator((ctx, op, affected) => {
	if (!isNumberNode(affected)) {
		ctx.addError(op, 'The operator can only be applied to number field');
	}
});

const validateArrayComparisonOperator = createComparisonOperatorValidator((ctx, op, affected) => {
	if (!isArrayNode(affected)) {
		ctx.addError(op, 'The operator can only be applied to list field');
	}
});

const OPERATOR_VALIDATORS: {
	[T in OperatorType]: (
		ctx: ValidatorContext,
		operator: Extract<OperatorNode, AbstractOperator<T>>
	) => void;
} = {
	[OperatorType.And]: validateNOperator,
	[OperatorType.Or]: validateNOperator,
	[OperatorType.Xor]: validateNOperator,
	[OperatorType.Not]: validateUOperator,
	// Shared
	[OperatorType.Eq]: (ctx, op) => {
		if (!isValidJson(op.value)) {
			ctx.addError(op, 'The value must be in JSON format');
		} else {
			const expected = createValueTypeCheckAgainstAffectedNode(ctx, op)?.(op.value);
			if (expected !== undefined) {
				ctx.addError(op, `The entered value ${EXPECTED_VALUE_TYPE_ERRORS[expected]}`);
			}
		}
	},
	[OperatorType.In]: (ctx, op) => {
		if (op.values.length === 0) {
			ctx.addError(op, 'Add at least one value');
		} else {
			if (op.values.length === 1) {
				ctx.addWarning(
					op,
					'The `In` operator with one value is redundant, use the `Equal` operator'
				);
			}
			const invalid = op.values.filter((v) => !isValidJson(v));
			if (invalid.length > 0) {
				ctx.addError(op, `The following values must be in JSON format: "${invalid.join('", "')}"`);
			} else {
				const check = createValueTypeCheckAgainstAffectedNode(ctx, op);
				if (check !== undefined) {
					const values = new Set<string>();
					const duplicatedValues: string[] = [];
					for (let i = 0; i < op.values.length; i++) {
						const value = op.values[i];
						const expected = check(value);
						if (expected !== undefined) {
							ctx.addError(op, `The value "${value}" ${EXPECTED_VALUE_TYPE_ERRORS[expected]}`);
						} else if (values.has(value)) {
							duplicatedValues.push(value);
						} else {
							values.add(value);
						}
					}
					if (duplicatedValues.length > 0) {
						ctx.addError(op, `Duplicated values: '${duplicatedValues.join("', '")}'`);
					}
				}
			}
		}
	},
	// String
	[OperatorType.Format]: (ctx, op) => {
		if (!isKnownJsonSchemaFormat(op.value)) {
			ctx.addWarning(op, 'Unknown JSON Schema format');
		}
		checkAffected(ctx, op, (affected) => {
			if (!isStringNode(affected)) {
				ctx.addError(op, 'The operator can only be applied to string fields');
			}
		});
	},
	[OperatorType.Pattern]: (ctx, op) => {
		if (!isValidRegExp(op.value)) {
			ctx.addError(op, 'Invalid regular expression');
		} else if (op.value.length === 0) {
			ctx.addWarning(
				op,
				'It looks like you forgot to fill in the value, if not, then ignore this warning message'
			);
		}
		checkAffected(ctx, op, (affected) => {
			if (!isStringNode(affected)) {
				ctx.addError(op, 'The operator can only be applied to string fields');
			}
		});
	},
	[OperatorType.MinLength]: validateStringComparisonOperator,
	[OperatorType.MaxLength]: validateStringComparisonOperator,
	// Number
	[OperatorType.Less]: validateNumberComparisonOperator,
	[OperatorType.LessOrEq]: validateNumberComparisonOperator,
	[OperatorType.Greater]: validateNumberComparisonOperator,
	[OperatorType.GreaterOrEq]: validateNumberComparisonOperator,
	[OperatorType.MultipleOf]: validateNumberComparisonOperator,
	// Array
	[OperatorType.Contains]: (ctx, op) => {
		const operand = op.operand;
		if (operand === undefined) {
			ctx.addError(op, 'Missing operand');
		} else {
			checkAffected(ctx, op, (affected) => {
				const child = getNodeChild(affected);
				if (child === undefined) {
					ctx.addError(op, 'Child element of the applied field not found');
				} else {
					using _affected = ctx.push('affectedNode', child);
					validateOperator(ctx, operand);
				}
			});
		}
	},
	[OperatorType.MinItems]: validateArrayComparisonOperator,
	[OperatorType.MaxItems]: validateArrayComparisonOperator,
	[OperatorType.UniqueItems]: (ctx, op) => {
		checkAffected(ctx, op, (affected) => {
			if (!isArrayNode(affected)) {
				ctx.addError(op, 'The operator can only be applied to list field');
			}
		});
	},
	// Object
	[OperatorType.HasProperty]: (ctx, op) => {
		const propId = op.propertyId;
		if (propId === undefined) {
			ctx.addError(op, 'Missing value');
		} else {
			checkAffected(ctx, op, (affected) => {
				const prop = getNodeProperty(affected, propId);
				if (prop === null) {
					ctx.addError(op, `The operator cannot be applied to "${affected.type}" field`);
				} else if (prop === undefined) {
					ctx.addError(op, 'Specified field not found');
				}
			});
		}
	},
	[OperatorType.Property]: (ctx, op) => {
		const propId = op.propertyId;
		if (propId === undefined) {
			ctx.addError(op, 'Missing value');
		} else {
			checkAffected(ctx, op, (affected) => {
				const prop = getNodeProperty(affected, propId);
				if (prop === null) {
					ctx.addError(op, `The operator cannot be applied to "${affected.type}" field`);
				} else if (prop === undefined) {
					ctx.addError(op, 'Specified field not found');
				} else if (op.operator === undefined) {
					ctx.addError(op, 'Missing operand');
				} else {
					using _affected = ctx.push('affectedNode', prop);
					validateOperator(ctx, op.operator);
				}
			});
		}
	}
};

function validateOperator(ctx: ValidatorContext, op: Operator) {
	OPERATOR_VALIDATORS[op.op](ctx, op as never);
}

function validateEnumNode(ctx: ValidatorContext, node: EnumNode | MultiEnumNode) {
	if (node.items.length === 0) {
		ctx.addError(node, 'Add at least one element');
	} else {
		if (node.items.length === 1) {
			ctx.addWarning(node, 'Use the `Boolean` field if you need to select from a single item');
		}
		const labels = new Set<string>();
		const duplicatedLabels: Node[] = [];
		const values = new Set<string>();
		const duplicatedValues: Node[] = [];
		using _valueType = ctx.push('enumValueType', node.valueType);
		for (let i = 0; i < node.items.length; i++) {
			const item = node.items[i];
			if (labels.has(item.label)) {
				duplicatedLabels.push(item);
			} else {
				labels.add(item.label);
			}
			labels.add(item.label);
			if (values.has(item.value)) {
				duplicatedValues.push(item);
			} else {
				values.add(item.value);
			}
			validateNode(ctx, item);
		}
		for (const d of duplicatedValues) {
			ctx.addError(d, 'Duplicated value');
		}
		for (const l of duplicatedLabels) {
			ctx.addWarning(l, 'Duplicated label');
		}
	}
}
const NODE_VALIDATORS: {
	[T in NodeType]: (ctx: ValidatorContext, node: Extract<Node, AbstractNode<T>>) => void;
} = {
	[NodeType.Object]: (ctx, node) => {
		if (node.properties.length === 0) {
			ctx.addError(node, 'Properties are missing');
		}
		for (let i = 0; i < node.properties.length; i++) {
			validateNode(ctx, node.properties[i]);
		}
	},
	[NodeType.ObjectProperty]: (ctx, node) => {
		if (
			node.complementary !== undefined &&
			node.dependencies.find((d) => d.id === node.complementary) === undefined
		) {
			ctx.addError(node, 'Invalid `Complement` mark, try selecting/unselecting this mark');
		} else if (node.dependencies.length === 1) {
			if (node.complementary === undefined) {
				if (node.dependencies[0].predicate?.operator === undefined) {
					ctx.addError(
						node.dependencies[0],
						'The only dependency should be marked as `Complement`'
					);
				}
			} else if (isCustomizableNode(node.property) && node.property.options.required) {
				ctx.addWarning(
					node.dependencies[0],
					'Redundant dependency, because the condition (presence of a value in the parent field) is always true for required field'
				);
			} else if (isObjectNode(node.property)) {
				ctx.addWarning(
					node.dependencies[0],
					'Dependency on objects without specifying a predicate is meaningless, define a predicate.'
				);
			}
		}
		const emptyDeps: NodeId[] = [];
		validateNode(ctx, node.property);
		using _complementary = ctx.push('complementary', node.complementary);
		using _affected = ctx.push('affectedNode', node.property);
		for (let i = 0; i < node.dependencies.length; i++) {
			const dep = node.dependencies[i];
			if (dep.properties.length === 0) {
				emptyDeps.push(dep.id);
			}
			validateNode(ctx, node.dependencies[i]);
		}
		if (emptyDeps.length === 1) {
			if (node.dependencies.length === 1) {
				ctx.addWarning(node.dependencies[0], 'Redundant dependency');
			}
		} else if (emptyDeps.length > 1) {
			ctx.addWarning(
				node,
				'You have more than one empty dependency, perhaps you can merge them using the `Or` operator'
			);
		}
	},
	[NodeType.ObjectPropertyDependency]: (ctx, node) => {
		const isComplement = ctx.peek('complementary') === node.id;
		// NOTE: dependency may not have properties
		if (!isComplement) {
			if (node.predicate === undefined) {
				ctx.addError(node, 'Specify the predicate or mark the dependency as `Complement`');
			} else {
				validateNode(ctx, node.predicate);
			}
		}
		for (let i = 0; i < node.properties.length; i++) {
			validateNode(ctx, node.properties[i]);
		}
	},
	[NodeType.Predicate]: (ctx, node) => {
		if (node.operator === undefined) {
			ctx.addError(node, 'Specify the operator');
		} else {
			validateNode(ctx, node.operator);
		}
	},
	[NodeType.Operator]: validateOperator,
	[NodeType.Array]: (ctx, node) => {
		if (node.item === undefined) {
			ctx.addError(node, 'Missing item definition');
		} else {
			validateNode(ctx, node.item);
		}
	},
	[NodeType.Grid]: (ctx, node) => {
		if (node.cells.length === 0) {
			ctx.addError(node, 'Add at least one element');
		} else {
			for (let i = 0; i < node.cells.length; i++) {
				validateNode(ctx, node.cells[i].node);
			}
		}
	},
	[NodeType.Enum]: validateEnumNode,
	[NodeType.MultiEnum]: validateEnumNode,
	[NodeType.EnumItem]: (ctx, node) => {
		if (node.label.length === 0) {
			ctx.addWarning(node, 'Try not to create empty labels');
		}
		const valueType = ctx.peek('enumValueType');
		if (valueType === undefined) {
			ctx.addError(node, 'This node appears to be misplaced, remove it');
		} else {
			if (valueType === EnumValueType.JSON && !isValidJson(node.value)) {
				ctx.addError(node, 'This value should match JSON format');
			}
		}
	},
	[NodeType.String]: noop,
	[NodeType.Number]: noop,
	[NodeType.Boolean]: noop,
	[NodeType.File]: noop,
	[NodeType.Tags]: noop,
	[NodeType.Range]: (ctx, node) => {
		const allowed = ctx.getAvailableRangeValueTypes();
		if (allowed.length === 0) {
			ctx.addError(node, 'This node cannot be used with the current theme.');
		} else if (!allowed.includes(node.valueType)) {
			ctx.addError(
				node,
				`Invalid range value type "${RANGE_VALUE_TYPE_TITLES[node.valueType]}", one of the following values is expected: ${JSON.stringify(allowed.map((t) => RANGE_VALUE_TYPE_TITLES[t]))}`
			);
		}
	}
};

export function validateNode(ctx: ValidatorContext, node: Node) {
	if (isCustomizableNode(node)) {
		ctx.validateCustomizableNodeOptions(node);
	}
	NODE_VALIDATORS[node.type](ctx, node as never);
}
