import { fail } from '@sveltejs/kit';

import { isValid, createFormHandler, createAction } from '$lib/server/index.js';
import type { InitialFormData } from '$lib/model.js';

import type { Actions } from './$types.js';
import { schema, uiSchema } from './model.js';
import * as defaults from './form-defaults.js';

type Model = Record<string, string>

export const load = async () => {
  const form = {
    initialValue: { 'newKey::123': 'foo', 'also.333': 'bar' },
    schema,
    uiSchema,
  } satisfies InitialFormData<Model>
  return { form };
};

const handleForm = createFormHandler<Model, true>({
  ...defaults,
  schema,
  uiSchema,
  sendData: true
});

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
    (data: Model) => {
      console.log(data);
    }
  )
} satisfies Actions;
