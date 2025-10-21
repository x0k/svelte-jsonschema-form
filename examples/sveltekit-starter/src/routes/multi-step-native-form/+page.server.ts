import { fail } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { isValid, createFormHandler } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";

import { schema, STEP_KEY, stepNames, type Stepped } from "./model";
import type { Actions } from "./$types";

const handleForm = createFormHandler({
  ...defaults,
  schema,
  sendData: true,
});

export const load = async () => {
  return {
    form: {
      schema,
      initialValue: {
        [STEP_KEY]: "first",
      } satisfies Stepped,
    } satisfies InitialFormData,
  };
};

export const actions = {
  default: async ({ request }) => {
    const [form, data] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!isValid<Stepped>(form, data)) {
      return fail(400, { form });
    }
    const index = stepNames.indexOf(data[STEP_KEY]);
    if (index < stepNames.length - 1) {
      form.isValid = false;
      data[STEP_KEY] = stepNames[index + 1];
    } else {
      // all steps completed
      console.log(data);
    }
    return {
      form,
    };
  },
} satisfies Actions;
