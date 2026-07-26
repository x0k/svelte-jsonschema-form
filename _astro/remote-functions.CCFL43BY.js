import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{a as t,c as n,i as r,n as i,r as a}from"./model.UVZZgLR2.js";import{t as o}from"./post.DblLiz6z.js";var s=`<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import type { Model } from "$lib/post";
  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  const form = createForm(
    await connect<Model>(createPost, {
      ...defaults,
      ...initialData,
    })
  );
<\/script>

<BasicForm {form} novalidate />
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
`,l=e({default:()=>d,meta:()=>u}),u=t({category:i.SvelteKitIntegrations,title:`Remote Functions`,description:`SvelteKit remote functions for server-side logic.`,tags:[a.RemoteFunctions]}),d=r({sveltekit:`remoteFunctions`,files:{"src/lib/post.ts":o,"src/routes/data.remote.ts":c,"src/routes/+page.svelte":s},codeTransformers:[n],widgets:[`textarea`]});export{l as n,u as t};