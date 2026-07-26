import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{a as t,c as n,i as r,n as i,r as a}from"./model.UVZZgLR2.js";import{t as o}from"./post.DblLiz6z.js";var s=`<script lang="ts">
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";
  import FormContent from "./form-content.svelte";

  const initialData = await getInitialData();

  const formOptions = await connect(createPost, {
    ...defaults,
    ...initialData,
  });
<\/script>

<!-- WARN: To prevent server-side validation errors from flickering or disappearing,
  JavaScript must be disabled (to prevent hydration).
  To do this, you’ll need to download this project and run it locally. -->
<form
  method={createPost.method}
  action={createPost.action}
  style="display: flex; flex-direction: column; gap: 1rem;"
  novalidate
>
  <FormContent {formOptions} />
</form>
`,c=`import type { InitialFormData } from "@sjsf/sveltekit";
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
`,l=`<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext,
    SubmitButton,
    type FormOptions,
  } from "@sjsf/form";

  const { formOptions }: { formOptions: FormOptions<any> } = $props();

  const form = createForm(formOptions);
  setFormContext(form);
<\/script>

<Content />
<SubmitButton />
`,u=e({default:()=>f,meta:()=>d}),d=t({category:i.SvelteKitIntegrations,title:`Remote Functions Without JS`,description:`Remote functions with JavaScript disabled.`,tags:[a.RemoteFunctions,a.NoJs]}),f=r({sveltekit:`remoteFunctions`,files:{"src/lib/post.ts":o,"src/routes/data.remote.ts":c,"src/routes/+page.svelte":s,"src/routes/form-content.svelte":l},codeTransformers:[n],widgets:[`textarea`]});export{u as n,d as t};