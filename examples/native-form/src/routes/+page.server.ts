import { fail } from "@sveltejs/kit";
import type { Schema } from "@sjsf/form";
import {
  initForm,
  makeFormDataParser,
  validateForm,
} from "@sjsf/sveltekit/server";

import { createValidator } from '$lib/form-defaults'

import type { Actions } from "./$types";

const validator = createValidator()

const parseFormData = makeFormDataParser({
  validator,
});

const schema: Schema = {
  title: "Registration form",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "number",
      title: "Age",
      minimum: 21,
    },
  },
  required: ["firstName", "lastName", "age"],
};

export const load = async () => {
  const form = initForm({ schema, sendSchema: true });
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const data = await parseFormData({
      request,
      schema,
    });
    const form = await validateForm({
      sendData: true,
      request,
      schema,
      validator,
      data,
    });
    if (!form.isValid) {
      return fail(400, { form });
    }
    // TODO: Do something with `data`
    return {
      form,
    };
  },
} satisfies Actions;
