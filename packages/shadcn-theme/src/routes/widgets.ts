import { SvelteMap } from 'svelte/reactivity';
import Ajv from 'ajv';

import { defaultMerger } from '@sjsf/form/core';
import type { Schema, UiSchema, UiSchemaRoot, ValidationError } from '@sjsf/form';
import { AjvValidator, addFormComponents, DEFAULT_AJV_CONFIG } from '@sjsf/ajv8-validator';
import { getDefaultFormState } from '@sjsf/form/get-default-form-state';

const states = (schema: Schema): Schema => ({
	type: 'object',
	properties: {
		default: schema,
		disabled: schema,
		error: schema
	}
});

const boolean: Schema = {
	type: 'boolean'
};

const enumeration: Schema = {
	type: 'string',
	enum: ['foo', 'bar', 'fuzz', 'qux']
};

const uniqueArray: Schema = {
	type: 'array',
	items: enumeration,
	uniqueItems: true
};

const file: Schema = {
	type: 'string',
	format: 'data-url'
};

const number: Schema = {
	type: 'number'
};

const text: Schema = {
	type: 'string'
};

export const schema: Schema = {
	type: 'object',
	properties: {
		checkbox: states(boolean),
		checkboxes: states(uniqueArray),
		file: states(file),
		multiFile: states({
			type: 'array',
			items: file
		}),
		number: states(number),
		range: states(number),
		radio: states(enumeration),
		select: states(enumeration),
		multiSelect: states(uniqueArray),
		text: states(text),
		textarea: states(text)
	}
};

const uiStates = (uiSchema: UiSchema): UiSchema => ({
	default: uiSchema,
	disabled: {
		...uiSchema,
		'ui:options': {
			...uiSchema['ui:options'],
			input: {
				...uiSchema['ui:options']?.input,
				disabled: true
			}
		}
	},
	error: uiSchema
});

export const uiSchema: UiSchemaRoot = {
	checkbox: uiStates({}),
	checkboxes: uiStates({
		'ui:widget': 'checkboxes'
	}),
	file: uiStates({}),
	multiFile: uiStates({}),
	number: uiStates({}),
	range: uiStates({
		'ui:options': {
			input: {
				type: 'range'
			}
		}
	}),
	radio: uiStates({
		'ui:widget': 'radio'
	}),
	select: uiStates({}),
	multiSelect: uiStates({}),
	text: uiStates({}),
	textarea: uiStates({
		'ui:widget': 'textarea'
	})
};

export const errors = new SvelteMap(
	[
		'checkbox',
		'checkboxes',
		'file',
		'multiFile',
		'number',
		'radio',
		'select',
		'multiSelect',
		'text',
		'textarea'
	].map((key) => [
		key,
		[
			{
				error: null,
				instanceId: `root_${key}_error`,
				propertyTitle: 'error',
				message: `${key} error`
			}
		] satisfies ValidationError<unknown>[]
	])
);

export const validator = new AjvValidator(addFormComponents(new Ajv(DEFAULT_AJV_CONFIG)), uiSchema);

export const initialState = getDefaultFormState(
	validator,
	defaultMerger,
	schema,
	undefined,
	schema
);
