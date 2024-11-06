import { createValidator } from '@sjsf/ajv8-validator';
import { fail } from '@sveltejs/kit';

import { initForm, parseRequest, validateForm } from '$lib/server';

import type { Actions } from './$types';
import { schema } from './schema';

const validator = createValidator();

export const load = async () => {
	const form = initForm({ schema, validator });
	return { form };
};

export const actions = {
	default: async (event) => {
		return fail(400, {
			form: validateForm({
				schema,
				validator,
				data: await parseRequest(event.request)
			})
		});
	}
} satisfies Actions;
