import { createValidator } from '@sjsf/ajv8-validator';
import { fail } from '@sveltejs/kit';

import { initForm, parseFormData, validateForm } from '$lib/server';

import type { Actions } from './$types';
import { schema } from './schema';

const validator = createValidator();

export const load = async () => {
	const form = initForm({ initialValue: "123", schema, validator });
	const form2 = initForm({ initialValue: 123, schema, validator, sendSchema: true });
	return { form, form2 };
};

export const actions = {
	default: async (event) => {
		return fail(400, {
			form: validateForm({
				schema,
				validator,
				data: parseFormData(await event.request.formData())
			})
		});
	},
	register: async (event) => {
		return {
			form2: validateForm({
				schema,
				validator,
				data: parseFormData(await event.request.formData())
			})
		};
	}
} satisfies Actions;
