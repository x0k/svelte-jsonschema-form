import{p as t}from"./package.TpDzObST.js";import{p as e}from"./post-model.DH7AMiqq.js";import{o as n}from"./advanced-examples.DS8dmNvb.js";import"./each.mpKmeHYv.js";import"./render.gEp3m_LP.js";import"./definitions.DHCzoh2g.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.Dj95Z4E7.js";import"./shared.DfRIL9pD.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CEFJ03XP.js";/* empty css                                                       *//* empty css                                                                 */const o=`import type { Actions } from "@sveltejs/kit";
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
