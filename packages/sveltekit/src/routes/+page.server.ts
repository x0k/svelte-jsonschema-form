import { createFormValidator } from '@sjsf/ajv8-validator';

import { initForm, makeFormDataParser, validateForm } from '$lib/server/index.js';

import type { Actions } from './$types.js';
import { schema } from './model.js'

const validator = createFormValidator();

const parseFormData = makeFormDataParser({
  validator
});

export const load = async () => {
  const form = initForm({
    initialValue: { 'newKey::123': 'foo', 'also.333': 'bar' },
    sendSchema: true,
    schema,
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
      form: await validateForm({
        request,
        schema,
        validator,
        data,
        sendData: true
      })
    };
  },
  second: async ({ request }) => {
    return {
      form2: await validateForm({
        request,
        schema,
        validator,
        data: { field: '123' }
      })
    };
  }
} satisfies Actions;
