import type { Schema } from '@sjsf/form';
import { createValidator } from '@sjsf/ajv8-validator';

import { initForm, parseFormData, validateForm } from '$lib/server';

import type { Actions } from './$types';

const validator = createValidator();

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
	const form = initForm({ initialValue: {}, schema, validator, sendSchema: true });
	return { form };
};

export const actions = {
	default: async (event) => {
		return {
			form: validateForm({
				schema,
				validator,
				data: parseFormData(await event.request.formData())
			})
		};
	}
	// register: async (event) => {
	// 	return {
	// 		form2: validateForm({
	// 			schema,
	// 			validator,
	// 			data: parseFormData(await event.request.formData())
	// 		})
	// 	};
	// }
} satisfies Actions;
