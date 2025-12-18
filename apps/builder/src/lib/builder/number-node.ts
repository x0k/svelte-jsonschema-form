import type { FromSchema } from 'json-schema-to-ts';
import type { Schema } from '@sjsf/form';

import type { AbstractCustomizableNode, NodeType } from './node-base.js';

export const NUMBER_NODE_OPTIONS_SCHEMA = {
	title: 'Number options',
	type: 'object',
	properties: {
		integer: {
			title: 'Integer',
			type: 'boolean'
		},
		widget: {
			title: 'Widget',
			type: 'string',
			default: 'numberWidget'
		},
		help: {
			title: 'Help',
			type: 'string'
		},
		default: {
			title: 'Default value',
			type: 'number'
		},
		minimum: {
			title: 'Minimum',
			type: 'number'
		},
		maximum: {
			title: 'Maximum',
			type: 'number'
		},
		multipleOf: {
			title: 'Multiple of',
			type: 'number'
		}
	},
	required: ['widget']
} as const satisfies Schema;

export type NumberOptions = FromSchema<typeof NUMBER_NODE_OPTIONS_SCHEMA>;

export interface NumberNode extends AbstractCustomizableNode<NodeType.Number, NumberOptions> {}
