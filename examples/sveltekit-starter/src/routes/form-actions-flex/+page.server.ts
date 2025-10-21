import { fail, type Actions } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler, isValid } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";
import { type FormValue, schema } from "$lib/post-model";


export const load = async () => {
  return {
    // Should match action name
    form: {
      schema,
      initialValue: { title: "New post", content: "" } satisfies FormValue,
    } satisfies InitialFormData,
  };
};

const handleForm = createFormHandler({
  ...defaults,
  schema,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form, data, invalid] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!isValid<FormValue>(form, data)) {
      return fail(400, { form });
    }
    const { title, content } = data;
    if (title.length > 100) {
      return fail(400, {
        form: invalid([{ path: ["title"], message: "Title is too long" }]),
      });
    }
    // Your logic here
    return { form, post: { id: "new-post", title, content } };
  },
} satisfies Actions;
