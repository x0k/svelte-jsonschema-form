import type { InitialFormData } from "@sjsf/sveltekit";
import { createAction } from "@sjsf/sveltekit/server";
import type { Actions } from "@sveltejs/kit";

import * as post from "$lib/post";
import * as defaults from "$lib/sjsf/defaults";

export const load = async () => {
  return {
    // Should match action name
    form: {
      ...post,
      initialValue: { title: "New post", content: "" },
    } satisfies InitialFormData<post.Model>,
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      ...post,
      name: "form",
      sendData: true,
    },
    ({ title, content }: post.Model) => {
      if (title.length > 100) {
        return [{ path: ["title"], message: "Title is too long" }];
      }
      // Your logic here
      return { post: { id: "new-post", title, content } };
    }
  ),
} satisfies Actions;
