import{p as t}from"./package.DFQJTP9F.js";import{p as e}from"./post-model.DH7AMiqq.js";import{o as n}from"./advanced-examples.BZW7Ids9.js";import"./each.B6EQyiei.js";import"./render.p9uU9aNd.js";import"./definitions.CQdNrImE.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CRTjy3CY.js";import"./shared.D29q2wXs.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CoMtafGT.js";/* empty css                                                       *//* empty css                                                                 */const o=`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createAction } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";
import { schema, type FormValue } from "$lib/post-model";

export const load = async () => {
  return {
    // Should match action name
    form: {
      schema,
      initialValue: { title: "New post", content: "" } satisfies FormValue,
    } satisfies InitialFormData,
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
    ({ title, content }: FormValue) => {
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

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
<\/script>

<SvelteKitForm
  {...defaults}
  {meta}
  onSuccess={(result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  }}
/>
`,y={package:n(t),files:{"src/lib/post-model.ts":e,"src/routes/+page.server.ts":o,"src/routes/+page.svelte":s}};export{y as layer};
