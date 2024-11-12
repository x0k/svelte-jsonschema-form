import type { Schema } from '@sjsf/form';
import { createValidator } from '@sjsf/ajv8-validator';

import { initForm, makeFormDataParser, validateForm } from '$lib/server';

import type { Actions } from './$types';

const validator = createValidator();

const parseFormData = makeFormDataParser({
	validator
});

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

export const load = async () => {
	const form = initForm({ initialValue: { "newKey::123": "foo" }, schema, validator, sendSchema: true });
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		return {
			form: validateForm({
				schema,
				validator,
				data: await parseFormData({
					schema,
					request,
				}),
				sendData: true
			})
		};
	},
	register: async () => {
		return {
			form2: validateForm({
				schema,
				validator,
				data: { field: "123" }
			})
		}
	}
} satisfies Actions;
