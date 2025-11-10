import{p as t}from"./package.Du9ne4uO.js";import{p as e}from"./post.DKNNhoEq.js";import{a as o}from"./shared.B3UibPy3.js";import{o as n}from"./advanced-examples.CwYqb_9b.js";import"./each.DGpQ3d0C.js";import"./render.DQZAjqjS.js";import"./definitions.CBHryth7.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CYYQo0fI.js";import"./preload-helper.BUFao3bW.js";import"./buttons.C3u4I-7f.js";/* empty css                                                       *//* empty css                                                                 */const r=`import type { InitialFormData } from "@sjsf/sveltekit";
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
  ({ data: { title, content } }, invalid) => {
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
`,P={package:n(t),formDefaults:{idBuilderPackage:o},files:{"src/lib/post.ts":e,"src/routes/data.remote.ts":r,"src/routes/+page.svelte":s,"src/routes/form-content.svelte":i},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{P as layer};
