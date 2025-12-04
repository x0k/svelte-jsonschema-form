import{p as t}from"./package.Cgrt83H6.js";import{p as e}from"./post.DKNNhoEq.js";import{a as o}from"./shared.CqNx68X1.js";import{o as r}from"./advanced-examples.CggOOFS6.js";import"./each.Bj001F51.js";import"./render.xaapsoln.js";import"./definitions.DCK0418E.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.D5I5rCCl.js";import"./preload-helper.BUFao3bW.js";import"./buttons.B_cI2yLW.js";/* empty css                                                       *//* empty css                                                                 */const n=`import { invalid } from '@sveltejs/kit';
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
    console.log({ title, content })
    return { id: "new-post", title, content };
  }
);
`,s=`<script lang="ts">
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/form-defaults";

  import { createPost, getInitialData } from "./data.remote";
  import FormContent from './form-content.svelte';

  const initialData = await getInitialData();

  const formOptions = await connect(
    createPost,
    {
      ...defaults,
      ...initialData,
      idBuilder: createFormIdBuilder,
    }
  )
<\/script>

<form
  method={createPost.method}
  action={createPost.action}
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <FormContent {formOptions} />
</form>
`,i=`<script lang="ts">
  import { Content, createForm, setFormContext, SubmitButton, type FormOptions } from "@sjsf/form";

  const { formOptions }: { formOptions: FormOptions<any> } = $props()

  const form = createForm(formOptions);
  setFormContext(form)
<\/script>

<Content />
<SubmitButton />
`,P={package:r(t),formDefaults:{idBuilderPackage:o},files:{"src/lib/post.ts":e,"src/routes/data.remote.ts":n,"src/routes/+page.svelte":s,"src/routes/form-content.svelte":i},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{P as layer};
