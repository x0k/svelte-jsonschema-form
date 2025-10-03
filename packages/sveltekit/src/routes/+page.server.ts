import { fail } from '@sveltejs/kit';
import type { FormValue } from '@sjsf/form';

import { initForm, isValid, createFormHandler, createAction } from '$lib/server/index.js';

import type { Actions } from './$types.js';
import { schema, uiSchema } from './model.js';
import * as defaults from './form-defaults.js';

const handleForm = createFormHandler({
  ...defaults,
  schema,
  uiSchema,
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
    console.log(data);
    return {
      form
    };
  },
  second: async ({ request }) => {
    const [form2] = await handleForm(request.signal, await request.formData());
    return {
      form2
    };
  },
  third: createAction(
    {
      ...defaults,
      name: 'form3',
      schema,
      uiSchema,
      sendData: true
    },
    (data: FormValue) => {
      console.log(data);
    }
  )
} satisfies Actions;
