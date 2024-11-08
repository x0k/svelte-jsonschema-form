import { describe, expect, it } from 'vitest';
import type { Schema } from '@sjsf/form';

import {
	parseSchemaValue,
	type Entries,
	type SchemaValueParserOptions
} from './schema-value-parser';

const defaultOptions: SchemaValueParserOptions = {
	schema: {},
	entries: [],
	idPrefix: 'root',
	idSeparator: '.',
	idPseudoSeparator: '::',
	convertValue: (_, v) => v[0][1]
};

describe('parseSchemaValue', () => {
	it('Should parse empty entries', () => {
		expect(parseSchemaValue(defaultOptions)).toBeUndefined();
	});
	it('Should parse root value', () => {
		expect(
			parseSchemaValue({
				...defaultOptions,
				entries: [['root', 'value']]
			})
		).toBe('value');
	});
	it('Should parse simple schema', () => {
		const schema: Schema = {
			title: 'A registration form',
			description: 'A simple form example.',
			type: 'object',
			required: ['firstName', 'lastName'],
			properties: {
				firstName: {
					type: 'string',
					title: 'First name',
					default: 'Chuck'
				},
				lastName: {
					type: 'string',
					title: 'Last name'
				},
				age: {
					type: 'integer',
					title: 'Age'
				},
				bio: {
					type: 'string',
					title: 'Bio'
				},
				password: {
					type: 'string',
					title: 'Password',
					minLength: 3
				},
				telephone: {
					type: 'string',
					title: 'Telephone',
					minLength: 10
				}
			}
		};
		const entries: Entries<string> = [
			['root.firstName', 'Chuck'],
			['root.lastName', 'Norris'],
			['root.age', '75'],
			['root.bio', 'Roundhouse kicking asses since 1940'],
			['root.password', 'noneed'],
			['root.telephone', '1-800-KICKASS']
		];
		expect(parseSchemaValue({ ...defaultOptions, schema, entries })).toEqual({
			firstName: 'Chuck',
			lastName: 'Norris',
			age: '75',
			bio: 'Roundhouse kicking asses since 1940',
			password: 'noneed',
			telephone: '1-800-KICKASS'
		});
	});
	it('Should parse nested schema', () => {
		const schema: Schema = {
			title: 'A list of tasks',
			type: 'object',
			required: ['title'],
			properties: {
				title: {
					type: 'string',
					title: 'Task list title'
				},
				tasks: {
					type: 'array',
					title: 'Tasks',
					items: {
						type: 'object',
						required: ['title'],
						properties: {
							title: {
								type: 'string',
								title: 'Title',
								description: 'A sample title'
							},
							details: {
								type: 'string',
								title: 'Task details',
								description: 'Enter the task details'
							},
							done: {
								type: 'boolean',
								title: 'Done?',
								default: false
							}
						}
					}
				}
			}
		};
		const entries: Entries<string> = [
			['root.title', 'My current tasks'],
			['root.tasks.0.title', 'My first task'],
			[
				'root.tasks.0.details',
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
			],
			['root.tasks.0.done', 'on'],
			['root.tasks.1.title', 'My second task'],
			[
				'root.tasks.1.details',
				'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
			]
		];
		expect(parseSchemaValue({ ...defaultOptions, schema, entries })).toEqual({
			tasks: [
				{
					done: 'on',
					title: 'My first task',
					details:
						'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				},
				{
					done: undefined,
					title: 'My second task',
					details:
						'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
				}
			],
			title: 'My current tasks'
		});
	});
	it('Should parse schema with `additionalProperties`', () => {
		const schema: Schema = {
			title: 'A customizable registration form',
			description: 'A simple form with additional properties example.',
			type: 'object',
			required: ['firstName', 'lastName'],
			additionalProperties: {
				type: 'string'
			},
			properties: {
				firstName: {
					type: 'string',
					title: 'First name'
				},
				lastName: {
					type: 'string',
					title: 'Last name'
				}
			}
		};
		const entries: Entries<string> = [
			['root.firstName', 'Chuck'],
			['root.lastName', 'Norris'],
			['root.assKickCount::key-input', 'assKickCount'],
			['root.assKickCount', 'infinity'],
			['root.newKey::key-input', 'newKey'],
			['root.newKey', 'foo']
		];
		expect(parseSchemaValue({ ...defaultOptions, schema, entries })).toEqual({
			firstName: 'Chuck',
			lastName: 'Norris',
			assKickCount: 'infinity',
			newKey: 'foo'
		});
	});
	it('Should resolve references', () => {
		const schema: Schema = {
			definitions: {
				address: {
					type: 'object',
					properties: {
						street_address: {
							type: 'string'
						},
						city: {
							type: 'string'
						},
						state: {
							type: 'string'
						}
					},
					required: ['street_address', 'city', 'state']
				},
				node: {
					type: 'object',
					properties: {
						name: {
							type: 'string'
						},
						children: {
							type: 'array',
							items: {
								$ref: '#/definitions/node'
							}
						}
					}
				}
			},
			type: 'object',
			properties: {
				billing_address: {
					title: 'Billing address',
					$ref: '#/definitions/address'
				},
				shipping_address: {
					title: 'Shipping address',
					$ref: '#/definitions/address'
				},
				tree: {
					title: 'Recursive references',
					$ref: '#/definitions/node'
				}
			}
		};
		const entries: Entries<string> = [
			['root.shipping_address.street_address', '221B, Baker Street'],
			['root.shipping_address.city', 'London'],
			['root.shipping_address.state', 'N/A'],
			['root.billing_address.street_address', '21, Jump Street'],
			['root.billing_address.city', 'Babel'],
			['root.billing_address.state', 'Neverland'],
			['root.tree.name', 'root'],
			['root.tree.children.0.name', 'leaf'],
			['root.tree.children.0.children.0.name', 'bar'],
			['root.tree.children.1.name', 'foo']
		];
		expect(parseSchemaValue({ ...defaultOptions, schema, entries })).toEqual({
			tree: {
				children: [
					{
						children: [
							{
								children: [],
								name: 'bar'
							}
						],
						name: 'leaf'
					},
					{
						children: [],
						name: 'foo'
					}
				],
				name: 'root'
			},
			billing_address: {
				street_address: '21, Jump Street',
				city: 'Babel',
				state: 'Neverland'
			},
			shipping_address: {
				street_address: '221B, Baker Street',
				city: 'London',
				state: 'N/A'
			}
		});
	});
	it('Should parse schema with alternatives', () => {
		const schema: Schema = {
			definitions: {
				Color: {
					title: 'Color',
					type: 'string',
					anyOf: [
						{
							type: 'string',
							enum: ['#ff0000'],
							title: 'Red'
						},
						{
							type: 'string',
							enum: ['#00ff00'],
							title: 'Green'
						},
						{
							type: 'string',
							enum: ['#0000ff'],
							title: 'Blue'
						}
					]
				},
				Toggle: {
					title: 'Toggle',
					type: 'boolean',
					oneOf: [
						{
							title: 'Enable',
							const: true
						},
						{
							title: 'Disable',
							const: false
						}
					]
				}
			},
			title: 'Image editor',
			type: 'object',
			required: ['currentColor', 'colorMask', 'blendMode'],
			properties: {
				currentColor: {
					$ref: '#/definitions/Color',
					title: 'Brush color'
				},
				colorMask: {
					type: 'array',
					uniqueItems: true,
					items: {
						$ref: '#/definitions/Color'
					},
					title: 'Color mask'
				},
				toggleMask: {
					title: 'Apply color mask',
					$ref: '#/definitions/Toggle'
				},
				colorPalette: {
					type: 'array',
					title: 'Color palette',
					items: {
						$ref: '#/definitions/Color'
					}
				},
				blendMode: {
					title: 'Blend mode',
					type: 'string',
					oneOf: [
						{
							const: 'screen',
							title: 'Screen'
						},
						{
							const: 'multiply',
							title: 'Multiply'
						},
						{
							const: 'overlay',
							title: 'Overlay'
						}
					]
				}
			}
		};
		const entries: Entries<string> = [
			['root.currentColor', '1'],
			['root.colorMask', '2'],
			['root.toggleMask', '0'],
			['root.colorPalette.0', '0'],
			['root.blendMode', '0']
		];
		expect(parseSchemaValue({ ...defaultOptions, schema, entries })).toEqual({
			colorMask: ['2'],
			toggleMask: '0',
			colorPalette: ['0'],
			blendMode: '0',
			currentColor: '1'
		});
	});
});
