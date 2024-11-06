import type { Schema } from '@sjsf/form';

export const schema: Schema = {
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
