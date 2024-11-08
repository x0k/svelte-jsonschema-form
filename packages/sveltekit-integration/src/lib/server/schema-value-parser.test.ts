import { describe, expect, it } from 'vitest';
import { parseSchemaValue, type Entries, type SchemaValueParserOptions } from './schema-value-parser';
import type { Schema } from '@sjsf/form';

const PREFIX = 'root';
const defaultOptions: SchemaValueParserOptions = {
	schema: {},
	entries: [],
	idPrefix: PREFIX,
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
				entries: [[PREFIX, 'value']]
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
			age: "75",
			bio: 'Roundhouse kicking asses since 1940',
			password: 'noneed',
			telephone: '1-800-KICKASS'
		})
	});
});
