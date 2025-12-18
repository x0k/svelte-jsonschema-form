import type { FromSchema } from 'json-schema-to-ts';
import type { Schema } from '@sjsf/form';

import type { AbstractCustomizableNode, NodeType } from './node-base.js';

export const STRING_NODE_OPTIONS_SCHEMA = {
	type: 'object',
	title: 'String options',
	properties: {
		widget: {
			title: 'Widget',
			type: 'string',
			default: 'textWidget'
		},
		help: {
			title: 'Help',
			type: 'string'
		},
		default: {
			title: 'Default value',
			type: 'string'
		},
		format: {
			type: 'string',
			title: 'Format',
			description: 'JSON Schema string formats'
		},
		maxLength: {
			title: 'Max length',
			type: 'number',
			minimum: 0
		},
		minLength: {
			title: 'Min length',
			type: 'number',
			minimum: 0
		},
		pattern: {
			title: 'Pattern',
			description: 'Regular expression, preferably using the ECMA-262 flavour',
			type: 'string',
			format: 'regexp'
		}
	},
	required: ['widget'],
	dependencies: {
		widget: {
			oneOf: [
				{
					type: 'object',
					properties: {
						widget: {
							const: 'textWidget'
						},
						inputType: {
							title: 'Input type',
							enum: [
								'color',
								'date',
								'datetime-local',
								'email',
								'hidden',
								'month',
								'password',
								'tel',
								'text',
								'time',
								'url',
								'week'
							]
						},
						placeholder: {
							title: 'Placeholder',
							type: 'string'
						}
					}
				},
				{
					properties: {
						widget: {
							not: {
								const: 'textWidget'
							}
						}
					}
				}
			]
		}
	}
} as const satisfies Schema;

export type StringNodeOptions = FromSchema<typeof STRING_NODE_OPTIONS_SCHEMA> &
	FromSchema<(typeof STRING_NODE_OPTIONS_SCHEMA)['dependencies']['widget']['oneOf'][0]>;

export interface StringNode extends AbstractCustomizableNode<NodeType.String, StringNodeOptions> {}
