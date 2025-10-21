import type { InitialFormData } from "@sjsf/sveltekit";
import { createServerValidator } from "@sjsf/sveltekit/rf/server";

import { form, query } from "$app/server";
import * as defaults from "$lib/form-defaults";
import { schema, type FormValue } from "$lib/post-model";

export const getInitialData = query(async () => {
  return {
    schema,
    initialValue: { title: "New post", content: "" } satisfies FormValue,
  } satisfies InitialFormData;
});

export const createPost = form(
  createServerValidator<FormValue>({
    ...defaults,
    schema,
  }),
  ({ data: { title, content } }, invalid) => {
    if (title.length > 100) {
      invalid({ path: ["title"], message: "Title is too long" });
    }
    return { id: "new-post", title, content };
  }
);
