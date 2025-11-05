import{p as t}from"./package.Du9ne4uO.js";import{p as e}from"./post.DKNNhoEq.js";import{o}from"./advanced-examples.CxzyEp1g.js";import"./each.C_j-bgU5.js";import"./render.BriTjfDz.js";import"./definitions.Ba1XsyYK.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.1bGkIM3E.js";import"./shared.BelUoCWQ.js";import"./preload-helper.BUFao3bW.js";import"./buttons.BJuL6vbc.js";/* empty css                                                       *//* empty css                                                                 */const n=`import type { InitialFormData } from "@sjsf/sveltekit";
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
`,r=`<script lang="ts">
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
`,s=`<script lang="ts">
  import { Content, createForm, setFormContext, SubmitButton, type FormOptions } from "@sjsf/form";

  const { formOptions }: { formOptions: FormOptions<any> } = $props()

  const form = createForm(formOptions);
  setFormContext(form)
<\/script>

<Content />
<SubmitButton />
`,C={package:o(t),files:{"src/lib/post.ts":e,"src/routes/data.remote.ts":n,"src/routes/+page.svelte":r,"src/routes/form-content.svelte":s},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{C as layer};
