import{p as t}from"./package.Du9ne4uO.js";import{p as e}from"./post.DKNNhoEq.js";import{o as n}from"./advanced-examples.B54Ja_CL.js";import"./each.Bzig0V71.js";import"./render.BqBcYb3X.js";import"./definitions.DYoGDi9b.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.B5IERcLY.js";import"./shared.DpxGDDmb.js";import"./preload-helper.BUFao3bW.js";import"./buttons.vhGbKZEA.js";/* empty css                                                       *//* empty css                                                                 */const o=`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createAction } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";
import { schema, type CreatePost } from "$lib/post";

export const load = async () => {
  return {
    // Should match action name
    form: {
      schema,
      initialValue: { title: "New post", content: "" },
    } satisfies InitialFormData<CreatePost>,
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "form",
      schema,
      sendData: true,
    },
    ({ title, content }: CreatePost) => {
      if (title.length > 100) {
        return [{ path: ["title"], message: "Title is too long" }];
      }
      // Your logic here
      return { post: { id: "new-post", title, content } };
    }
  ),
} satisfies Actions;
`,s=`<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit/client";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
<\/script>

<SvelteKitForm
  {...defaults}
  idBuilder={createFormIdBuilder}
  {meta}
  onSuccess={(result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  }}
/>
`,y={package:n(t),files:{"src/lib/post.ts":e,"src/routes/+page.server.ts":o,"src/routes/+page.svelte":s}};export{y as layer};
