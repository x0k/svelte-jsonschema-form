import type { Schema } from '@sjsf/form';

import { assertThing } from '$lib/assert.js';
import { mergeSchemas } from '$lib/json-schema.js';

import { NodeType, type AbstractNode, type NodeId } from './node-base.js';
import type {
	CustomizableNode,
	EnumItemNode,
	Node,
	ObjectNode,
	ObjectPropertyDependencyNode,
	ObjectPropertyNode,
	OperatorNode
} from './node.js';
import { EnumValueType } from './enum.js';
import { OperatorType, type AbstractOperator } from './operator.js';
import {
	isArrayNode,
	isCustomizableNode,
	isFileNode,
	isMultiEnumNode,
	isObjectNode,
	isTagsNode
} from './node-guards.js';
import { getNodeChild, getNodeProperty } from './node-props.js';

export interface Scope {
	id: (node: CustomizableNode) => string;
}

export interface SchemaBuilderRegistries {
	scope: Scope;
	affectedNode: Node;
}

export interface SchemaBuilderContext {
	propertyNames: Map<NodeId, string>;
	createAndPushScope(): Scope & Disposable;
	push<K extends keyof SchemaBuilderRegistries>(
		registry: K,
		value: SchemaBuilderRegistries[K]
	): Disposable;
	peek<K extends keyof SchemaBuilderRegistries>(
		registry: K
	): SchemaBuilderRegistries[K] | undefined;
}

// TODO: Should we merge inner dependencies into root?
function buildPropertyDependencies(
	ctx: SchemaBuilderContext,
	triggerPropertyName: string,
	{ complementary: complementId, dependencies }: ObjectPropertyNode
): Schema | undefined {
	if (dependencies.length === 0) {
		return undefined;
	}
	if (dependencies.length === 1) {
		const dependency = dependencies[0];
		const schema = buildSchema(ctx, dependency);
		if (complementId === undefined) {
			assertThing(dependency.predicate, 'property dependency predicate');
			const predicate = buildSchema(ctx, dependency.predicate);
			return {
				oneOf: [
					mergeSchemas(
						{
							properties: {
								[triggerPropertyName]: predicate
							}
						},
						schema
					),
					{
						properties: {
							[triggerPropertyName]: {
								not: predicate
							}
						}
					}
				]
			};
		}
		if (dependency.id !== complementId) {
			throw new Error(`Invalid node dependencies`);
		}
		const affected = ctx.peek('affectedNode');
		assertThing(affected, 'property dependencies affected node');
		if (isObjectNode(affected)) {
			throw new Error(`This dependency on the object does not make sense`);
		}
		// field with array schema
		if (
			isArrayNode(affected) ||
			isMultiEnumNode(affected) ||
			(isFileNode(affected) && affected.options.multiple) ||
			isTagsNode(affected)
		) {
			return {
				oneOf: [
					mergeSchemas(
						{
							properties: {
								[triggerPropertyName]: {
									minItems: 1
								}
							}
						},
						schema
					),
					{
						properties: {
							[triggerPropertyName]: {
								maxItems: 0
							}
						}
					}
				]
			};
		}
		return schema;
	}
	let complementIndex = -1;
	const predicates: Schema[] = [];
	const oneOf = dependencies.map((d, i): Schema => {
		if (d.id === complementId) {
			complementIndex = i;
			return buildSchema(ctx, d);
		}
		assertThing(d.predicate, 'dependency predicate');
		const predicate = buildSchema(ctx, d.predicate);
		predicates.push(predicate);
		return mergeSchemas(
			{
				properties: {
					[triggerPropertyName]: predicate
				}
			},
			buildSchema(ctx, d)
		);
	});
	if (complementIndex >= 0) {
		const complementSchema = oneOf[complementIndex];
		const props = (complementSchema.properties ??= {});
		props[triggerPropertyName] = {
			not:
				predicates.length === 1
					? predicates[0]
					: {
							anyOf: predicates
						}
		};
	}
	return { oneOf };
}

function buildObjectSchema(
	ctx: SchemaBuilderContext,
	node: ObjectNode | ObjectPropertyDependencyNode
): Schema {
	const scope = ctx.peek('scope');
	assertThing(scope, 'object scope');
	const properties = new Map<string, Schema>();
	const dependencies = new Map<string, Schema>();
	const required: string[] = [];
	for (let i = 0; i < node.properties.length; i++) {
		const p = node.properties[i];
		if (!isCustomizableNode(p.property)) {
			throw new Error();
		}
		const name = scope.id(p.property);
		properties.set(name, buildSchema(ctx, p.property));
		if (p.property.options.required) {
			required.push(name);
		}
		using _affected = ctx.push('affectedNode', p.property);
		const deps = buildPropertyDependencies(ctx, name, p);
		if (deps !== undefined) {
			dependencies.set(name, deps);
		}
	}
	const obj: Schema = {
		type: 'object',
		properties: Object.fromEntries(properties)
	};
	if (required.length > 0) {
		obj.required = required;
	}
	if (dependencies.size > 0) {
		obj.dependencies = Object.fromEntries(dependencies);
	}
	return obj;
}

const OPERATOR_SCHEMA_BUILDERS: {
	[T in OperatorType]: (
		ctx: SchemaBuilderContext,
		operator: Extract<OperatorNode, AbstractOperator<T>>
	) => Schema;
} = {
	[OperatorType.And]: (ctx, op) => ({
		allOf: op.operands.map((o) => buildOperator(ctx, o))
	}),
	[OperatorType.Or]: (ctx, op) => ({
		anyOf: op.operands.map((o) => buildOperator(ctx, o))
	}),
	[OperatorType.Xor]: (ctx, op) => ({
		oneOf: op.operands.map((o) => buildOperator(ctx, o))
	}),
	[OperatorType.Not]: (ctx, op) => {
		assertThing(op.operand, 'not operator operand');
		return { not: buildOperator(ctx, op.operand) };
	},
	// Shared
	[OperatorType.Eq]: (ctx, op) => {
		const affected = ctx.peek('affectedNode');
		assertThing(affected, 'eq operator affected node');
		const schema = { const: JSON.parse(op.value) };
		return isMultiEnumNode(affected)
			? {
					items: schema,
					minItems: 1
				}
			: schema;
	},
	[OperatorType.In]: (ctx, op) => {
		const affected = ctx.peek('affectedNode');
		assertThing(affected, 'in operator affected node');
		const schema: Schema = {
			enum: op.values.map((v) => JSON.parse(v))
		};
		return isMultiEnumNode(affected)
			? {
					items: schema,
					minItems: 1
				}
			: schema;
	},
	// String
	[OperatorType.Format]: (_, op) => ({ format: op.value }),
	[OperatorType.Pattern]: (_, op) => ({ pattern: op.value }),
	[OperatorType.MinLength]: (_, op) => ({ minLength: op.value }),
	[OperatorType.MaxLength]: (_, op) => ({ maxLength: op.value }),
	// Number
	[OperatorType.Less]: (_, op) => ({ exclusiveMaximum: op.value }),
	[OperatorType.LessOrEq]: (_, op) => ({ maximum: op.value }),
	[OperatorType.Greater]: (_, op) => ({ exclusiveMinimum: op.value }),
	[OperatorType.GreaterOrEq]: (_, op) => ({ minimum: op.value }),
	[OperatorType.MultipleOf]: (_, op) => ({ multipleOf: op.value }),
	// Array
	[OperatorType.Contains]: (ctx, { operand }) => {
		assertThing(operand, 'contains operator operand');
		const affected = ctx.peek('affectedNode');
		assertThing(affected, 'contains operator affected node');
		const child = getNodeChild(affected);
		assertThing(child, 'contains operator affected node child');
		using _affected = ctx.push('affectedNode', child);
		return { contains: buildOperator(ctx, operand) };
	},
	[OperatorType.MinItems]: (ctx, op) => ({ minItems: op.value }),
	[OperatorType.MaxItems]: (ctx, op) => ({ maxItems: op.value }),
	[OperatorType.UniqueItems]: (ctx, op) => ({ uniqueItems: true }),
	// Object
	[OperatorType.HasProperty]: (ctx, { propertyId }) => {
		assertThing(propertyId, 'has property operator property id');
		const name = ctx.propertyNames.get(propertyId);
		assertThing(name, 'has property operator property name');
		return { required: [name] };
	},
	[OperatorType.Property]: (ctx, { propertyId, operator }) => {
		assertThing(propertyId, 'property operator property id');
		assertThing(operator, 'property operator operand');
		const affected = ctx.peek('affectedNode');
		assertThing(affected, 'property operator affected node');
		const prop = getNodeProperty(affected, propertyId);
		if (!prop) {
			throw new Error(`Property "${propertyId}" not found in "${affected.type}" node`);
		}
		const name = ctx.propertyNames.get(prop.id);
		assertThing(name, 'property operator property name');
		using _affected = ctx.push('affectedNode', prop);
		return {
			properties: {
				[name]: buildOperator(ctx, operator)
			},
			required: [name]
		};
	}
};

function buildOperator(ctx: SchemaBuilderContext, node: OperatorNode): Schema {
	return OPERATOR_SCHEMA_BUILDERS[node.op](ctx, node as never);
}

export function buildEnumValues(type: EnumValueType, items: EnumItemNode[]) {
	if (type === EnumValueType.JSON) {
		return items.map((i) => JSON.parse(i.value));
	}
	return items.map((i) => i.value);
}

function defaultArrayValue(values: string[] | undefined) {
	if (values === undefined || values.length === 0) {
		return undefined;
	}
	return values.map((v) => JSON.parse(v));
}

const SCHEMA_OPTIONS_KEYS = [
	'title',
	'description',
	'minItems',
	'maxItems',
	'uniqueItems',
	'default',
	'minLength',
	'maxLength',
	'pattern',
	'minimum',
	'exclusiveMinimum',
	'maximum',
	'exclusiveMaximum',
	'multipleOf'
] as const satisfies (keyof Schema)[];

function assignSchemaOptions<T extends Pick<Schema, (typeof SCHEMA_OPTIONS_KEYS)[number]>>(
	target: Schema,
	source: T
) {
	for (const key of SCHEMA_OPTIONS_KEYS) {
		const v = source[key];
		if (v !== undefined) {
			// @ts-expect-error
			target[key] = v;
		} else if (target[key] === undefined) {
			delete target[key];
		}
	}
	return target;
}

const NODE_SCHEMA_BUILDERS: {
	[T in NodeType]: (ctx: SchemaBuilderContext, node: Extract<Node, AbstractNode<T>>) => Schema;
} = {
	[NodeType.Object]: (ctx, node) => {
		using _scope = ctx.createAndPushScope();
		return assignSchemaOptions(buildObjectSchema(ctx, node), node.options);
	},
	[NodeType.ObjectProperty]: () => {
		throw new Error('Unexpected object property node');
	},
	[NodeType.ObjectPropertyDependency]: buildObjectSchema,
	[NodeType.Predicate]: (ctx, node) => {
		assertThing(node.operator, 'predicate operator');
		return buildSchema(ctx, node.operator);
	},
	[NodeType.Operator]: buildOperator,
	[NodeType.Array]: (ctx, { item, options }) => {
		assertThing(item, 'array item');
		return assignSchemaOptions(
			{
				type: 'array',
				items: buildSchema(ctx, item),
				default: defaultArrayValue(options.defaultValue)
			},
			options
		);
	},
	[NodeType.Grid]: (ctx, { cells, options }) => {
		using scope = ctx.createAndPushScope();
		const properties = new Map<string, Schema>();
		const required: string[] = [];
		for (let i = 0; i < cells.length; i++) {
			const p = cells[i].node;
			if (!isCustomizableNode(p)) {
				throw new Error();
			}
			const name = scope.id(p);
			properties.set(name, buildSchema(ctx, p));
			if (p.options.required) {
				required.push(name);
			}
		}
		const obj: Schema = {
			type: 'object',
			properties: Object.fromEntries(properties)
		};
		if (required.length > 0) {
			obj.required = required;
		}
		return assignSchemaOptions(obj, options);
	},
	[NodeType.Enum]: (_, { items, valueType, options }) => {
		return assignSchemaOptions(
			{
				enum: buildEnumValues(valueType, items),
				default: options.defaultValue && JSON.parse(options.defaultValue)
			},
			options
		);
	},
	[NodeType.MultiEnum]: (_, { items, options, valueType }) => {
		return assignSchemaOptions(
			{
				type: 'array',
				uniqueItems: true,
				items: {
					enum: buildEnumValues(valueType, items)
				},
				default: defaultArrayValue(options.defaultValue)
			},
			options
		);
	},
	[NodeType.EnumItem]: () => {
		throw new Error(`Unexpected enum item node`);
	},
	[NodeType.String]: (_, { options }) => {
		return assignSchemaOptions(
			{
				type: 'string'
			},
			options
		);
	},
	[NodeType.Number]: (_, { options }) => {
		return assignSchemaOptions(
			{
				type: options.integer ? 'integer' : 'number'
			},
			options
		);
	},
	[NodeType.Boolean]: (_, { options }) => {
		return assignSchemaOptions(
			{
				type: 'boolean'
			},
			options
		);
	},
	[NodeType.File]: (_, { options }) => {
		const file: Schema = options.native
			? {}
			: {
					type: 'string',
					format: 'data-url'
				};
		return assignSchemaOptions(
			options.multiple
				? {
						type: 'array',
						items: file
					}
				: file,
			options
		);
	},
	[NodeType.Tags]: (_, { options }) => {
		return assignSchemaOptions(
			{
				type: 'array',
				uniqueItems: true,
				items: {
					type: 'string'
				}
			},
			options
		);
	},
	[NodeType.Range]: (ctx, { options, startNode, endNode, valueType }) => {
		ctx.propertyNames.set(startNode.id, 'start');
		ctx.propertyNames.set(endNode.id, 'end');
		const subSchema: Schema = {
			type: valueType
		};
		const schema: Schema = {
			type: 'object',
			properties: {
				start: subSchema,
				end: subSchema
			}
		};
		if (options.required) {
			schema.required = ['start', 'end'];
		}
		return assignSchemaOptions(schema, options);
	}
};

export function buildSchema(ctx: SchemaBuilderContext, node: Node): Schema {
	return NODE_SCHEMA_BUILDERS[node.type](ctx, node as never);
}
