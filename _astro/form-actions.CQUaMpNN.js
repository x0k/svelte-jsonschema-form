import{p as t}from"./package.hp1iCy8g.js";import{p as e}from"./post.DKNNhoEq.js";import{F as o}from"./shared.inhqF9SA.js";import{o as n}from"./advanced-examples.DRBLstez.js";import"./each.CwI6gnJI.js";import"./render.BPWnz9YI.js";import"./definitions.D1Lns-po.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.B5tZQfr9.js";import"./preload-helper.BUFao3bW.js";import"./buttons.C0OgESBg.js";/* empty css                                                       *//* empty css                                                                 */const r=`import type { Actions } from "@sveltejs/kit";
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
  {meta}
  idBuilder={createFormIdBuilder}
  onSuccess={(result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  }}
/>
`,y={package:n(t),formDefaults:{idBuilderPackage:o},files:{"src/lib/post.ts":e,"src/routes/+page.server.ts":r,"src/routes/+page.svelte":s}};export{y as layer};
