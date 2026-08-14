import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.BHx2IYJR.js";import{t as a}from"./post.DblLiz6z.js";var o=`import type { InitialFormData } from "@sjsf/sveltekit";
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
`,s=`<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

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
`,c=e({default:()=>u,meta:()=>l}),l=t({category:r.SvelteKitIntegrations,title:`Form Actions`,description:`JSON Schema forms integrated with SvelteKit form actions.`,tags:[i.FormActions]}),u=n({sveltekit:`formActions`,files:{"src/lib/post.ts":a,"src/routes/+page.server.ts":o,"src/routes/+page.svelte":s},widgets:[`textarea`]});export{l as n,c as t};