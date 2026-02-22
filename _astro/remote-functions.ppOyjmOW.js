import{p as t}from"./package.WvldXyvO.js";import{p as e}from"./post.DKNNhoEq.js";import{a as r}from"./shared.Drj5yv28.js";import{o}from"./advanced-examples.Bei9BAEp.js";import"./each.CUa1Nqmd.js";import"./render.DDJEsVqs.js";import"./definitions.hz_Uyukr.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.DcbJgJh1.js";import"./preload-helper.BUFao3bW.js";import"./buttons.BFJ0DeHM.js";/* empty css                                                       *//* empty css                                                                 */const i=`import { invalid } from '@sveltejs/kit';
import type { InitialFormData } from "@sjsf/sveltekit";
import { createServerValidator } from "@sjsf/sveltekit/rf/server";

import { form, query } from "$app/server";
import * as defaults from "$lib/form-defaults";
import { schema, type CreatePost } from "$lib/post";

export const getInitialData = query(async () => {
  return {
    schema,
    initialValue: { title: "New post", content: "" },
  } satisfies InitialFormData<CreatePost>;
});

export const createPost = form(
  createServerValidator<CreatePost>({
    ...defaults,
    schema,
  }),
  ({ data: { title, content } }) => {
    if (title.length > 100) {
      invalid({ path: ["title"], message: "Title is too long" });
    }
    return { id: "new-post", title, content };
  }
);
`,a=`<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/form-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  const form = createForm(
    await connect(createPost, {
      ...defaults,
      ...initialData,
      idBuilder: createFormIdBuilder,
    })
  );
<\/script>

<BasicForm {form} novalidate />
`,F={package:o(t),formDefaults:{idBuilderPackage:r},files:{"src/lib/post.ts":e,"src/routes/data.remote.ts":i,"src/routes/+page.svelte":a},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{F as layer};
