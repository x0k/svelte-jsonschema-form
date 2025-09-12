import { fail } from '@sveltejs/kit';
import { createFormMerger } from '@sjsf/form/mergers/modern';
import { createFormValidator } from '@sjsf/ajv8-validator';

import { initForm, isValid, createFormHandler } from '$lib/server/index.js';

import type { Actions } from './$types.js';
import { schema, uiSchema } from './model.js';

const handleForm = createFormHandler({
  schema,
  uiSchema,
  createValidator: createFormValidator,
  createMerger: createFormMerger,
  sendData: true
});

export const load = async () => {
  const form = initForm({
    initialValue: { 'newKey::123': 'foo', 'also.333': 'bar' },
    sendSchema: true,
    schema,
    uiSchema
  });
  return { form };
};

export const actions = {
  first: async ({ request }) => {
    const [form, data] = await handleForm(request.signal, await request.formData());
    if (!isValid(form, data)) {
      return fail(400, { form });
    }
    return {
      form
    };
  },
  second: async ({ request }) => {
    const [form2] = await handleForm(request.signal, await request.formData());
    return {
      form2
    };
  }
} satisfies Actions;
