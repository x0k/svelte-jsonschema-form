import { describe, expect, it } from 'vitest';
import { makeFormDataEntriesConverter } from './convert-form-data-entries';
import { createValidator } from '@sjsf/ajv8-validator';
import { defaultMerger, type Schema } from '@sjsf/form/core';
import type { Entries } from './entry';

const defaultOptions = {
	validator: createValidator(),
	merger: defaultMerger,
	rootSchema: {}
};

const convert = makeFormDataEntriesConverter(defaultOptions);

describe('convertFormDataEntries', () => {
	it('Should return null for empty nullable schema', () => {
		expect(
			convert(
				{
					type: ['string', 'null']
				},
				[]
			)
		).toBeNull();
	});
	it('Should convert boolean', () => {
		const schema: Schema = { title: 'A boolean', type: 'boolean', default: false };
		const entries: Entries<string> = [['root.fixedNoToolbar.1', 'on']];
		expect(convert(schema, entries)).toEqual(true);
	});
	it('Should convert number', () => {
		const schema: Schema = { title: 'A number', type: 'number', default: 42 };
		const entries: Entries<string> = [['root.fixedNoToolbar.0', '42']];
		expect(convert(schema, entries)).toEqual(42);
	});
	it('Should return correct value from anyOf', () => {
		const schema: Schema = {
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
		};
		const entries: Entries<string> = [['root.currentColor', '1']];
		expect(convert(schema, entries)).toEqual('#00ff00');
	});
	it('Should return correct value from oneOf', () => {
		const schema: Schema = {
			title: 'Toggle',
			type: 'boolean',
			oneOf: [
				{ title: 'Enable', const: true },
				{ title: 'Disable', const: false }
			]
		};
		const entries: Entries<string> = [['root.toggleMask', '0']];
		expect(convert(schema, entries)).toEqual(true);
	});
	it('Should return correct value from enum', () => {
		const schema: Schema = { type: 'string', enum: ['foo', 'bar', 'fuzz', 'qux'] };
		const entries: Entries<string> = [['root.multipleChoicesList', '1']];
		expect(convert(schema, entries)).toEqual('bar');
	});
});
