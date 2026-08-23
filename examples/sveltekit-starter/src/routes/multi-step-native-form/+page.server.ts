import type { InitialFormData } from "@sjsf/sveltekit3";
import { createFormHandler } from "@sjsf/sveltekit3/server";
import { fail } from "@sveltejs/kit";

import * as defaults from "#lib/sjsf/defaults.js";

import type { Actions } from "./$types";
import { schema, STEP_KEY, stepNames, type Stepped } from "./model";

export const load = async () => {
  return {
    form: {
      schema,
      initialValue: {
        [STEP_KEY]: "first",
      },
    } satisfies InitialFormData<Stepped>,
  };
};

const handleForm = createFormHandler<Stepped, true>({
  ...defaults,
  schema,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form] = await handleForm(request.signal, await request.formData());
    if (!form.isValid) {
      return fail(400, { form });
    }
    const index = stepNames.indexOf(form.data[STEP_KEY]);
    if (index < stepNames.length - 1) {
      form.isValid = false as true;
      form.data[STEP_KEY] = stepNames[index + 1];
    } else {
      // all steps completed
      console.log(form.data);
    }
    return {
      form,
    };
  },
} satisfies Actions;
