import type { Schema } from '@sjsf/form';
import { createValidator2 } from '@sjsf/ajv8-validator';

import { initForm, makeFormDataParser, validateForm, validateForm2 } from '$lib/server/index.js';

import type { Actions } from './$types.js';

const validator = createValidator2();

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
  const form = initForm({
    initialValue: { 'newKey::123': 'foo', 'also.333': 'bar' },
    sendSchema: true,
    schema
  });
  return { form };
};

export const actions = {
  first: async ({ request }) => {
    const data = await parseFormData({
      request,
      schema
    });
    return {
      form: await validateForm2({
        request,
        schema,
        validator,
        data,
      })
    };
  },
  second: async () => {
    return {
      form2: validateForm({
        schema,
        validator,
        data: { field: '123' }
      })
    };
  }
} satisfies Actions;
