import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{a as t,i as n,n as r,r as i}from"./model.B98gGsUz.js";import{t as a}from"./post.DblLiz6z.js";var o=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";
import { fail, type Actions } from "@sveltejs/kit";

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

const handleForm = createFormHandler<post.Model, true>({
  ...defaults,
  ...post,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form, , invalid] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!form.isValid) {
      return fail(400, { form });
    }
    const { title, content } = form.data;
    if (title.length > 100) {
      return fail(400, {
        form: invalid([{ path: ["title"], message: "Title is too long" }]),
      });
    }
    // Your logic here
    return { form, post: { id: "new-post", title, content } };
  },
} satisfies Actions;
`,s=`<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onSuccess: (result) => {
      if (result.type === "success") {
        console.log(result.data?.post);
      }
    },
  });
<\/script>

<BasicForm {form} method="POST" />
`,c=e({default:()=>u,meta:()=>l}),l=t({category:r.SvelteKitIntegrations,title:`Form Actions Flex`,description:`Flexible form actions for different submission patterns.`,tags:[i.FormActions]}),u=n({sveltekit:`formActions`,files:{"src/lib/post.ts":a,"src/routes/+page.server.ts":o,"src/routes/+page.svelte":s},widgets:[`textarea`]});export{l as n,c as t};