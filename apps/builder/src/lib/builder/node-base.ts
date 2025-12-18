import type { FromSchema } from 'json-schema-to-ts';
import type { Brand } from '@sjsf/form/lib/types';
import type { Schema } from '@sjsf/form';

export enum NodeType {
	Object = 'object',
	ObjectProperty = 'object-property',
	ObjectPropertyDependency = 'object-property-dependency',
	Predicate = 'predicate',
	Operator = 'operator',
	Array = 'array',
	Grid = 'grid',
	Enum = 'enum',
	MultiEnum = 'multi-enum',
	EnumItem = 'enum-item',
	String = 'string',
	Number = 'number',
	Boolean = 'boolean',
	File = 'file',
	Tags = 'tags',
	Range = 'range'
}

export type NodeId = Brand<'node-id'>;

export const COMMON_OPTIONS_SCHEMA = {
	type: 'object',
	properties: {
		title: {
			title: 'Title',
			type: 'string'
		},
		description: {
			title: 'Description',
			type: 'string'
		},
		required: {
			title: 'Required',
			type: 'boolean'
		}
	},
	required: ['title', 'required']
} as const satisfies Schema;

export type CommonOptions = FromSchema<typeof COMMON_OPTIONS_SCHEMA>;

export interface AbstractNode<T extends NodeType> {
	id: NodeId;
	type: T;
}

export interface AbstractCustomizableNode<
	T extends NodeType,
	O extends {}
> extends AbstractNode<T> {
	options: CommonOptions & O;
}
