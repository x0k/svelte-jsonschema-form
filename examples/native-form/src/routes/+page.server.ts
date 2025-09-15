import { fail } from "@sveltejs/kit";
import type { Schema } from "@sjsf/form";
import { initForm, isValid, createFormHandler } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";

import type { Actions } from "./$types";

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

interface Value {
  firstName: string;
  lastName: string;
  age: number;
}

const handleForm = createFormHandler({
  ...defaults,
  schema,
  sendData: true,
});

export const load = async () => {
  const form = initForm({ schema, sendSchema: true });
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const [form, data] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!isValid<Value>(form, data)) {
      return fail(400, { form });
    }
    // TODO: Do something with `data`
    console.log(data);
    return {
      form,
    };
  },
} satisfies Actions;
