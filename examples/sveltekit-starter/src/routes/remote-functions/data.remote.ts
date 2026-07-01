import type { InitialFormData } from "@sjsf/sveltekit";
import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { invalid } from "@sveltejs/kit";

import { form, query } from "$app/server";
import * as post from "$lib/post";
import * as defaults from "$lib/sjsf/remote-defaults";

export const getInitialData = query(async () => {
  return {
    ...post,
    initialValue: { title: "New post", content: "" },
  } satisfies InitialFormData<post.Model>;
});

export const createPost = form(
  createServerValidator<post.Model>({
    ...defaults,
    ...post,
  }),
  ({ data }) => {
    if (data.title.length > 100) {
      invalid({ path: ["title"], message: "Title is too long" });
    }
    console.log(data);
    return { ...data, id: "new-post" };
  }
);
