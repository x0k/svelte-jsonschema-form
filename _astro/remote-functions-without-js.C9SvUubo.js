import{n as e}from"./shared.B9p8RNJ6.js";import{a as t}from"./layer.CUzcRAm9.js";import{t as n}from"./package.Dc7N-i8T.js";import{t as r}from"./post.BTN9G2hY.js";var i=`import { invalid } from '@sveltejs/kit';
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
`,a=`<script lang="ts">
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/form-defaults";

  import { createPost, getInitialData } from "./data.remote";
  import FormContent from "./form-content.svelte";

  const initialData = await getInitialData();

  const formOptions = await connect(createPost, {
    ...defaults,
    ...initialData,
    idBuilder: createFormIdBuilder,
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
`,o=`<script lang="ts">
  import { Content, createForm, setFormContext, SubmitButton, type FormOptions } from "@sjsf/form";

  const { formOptions }: { formOptions: FormOptions<any> } = $props()

  const form = createForm(formOptions);
  setFormContext(form)
<\/script>

<Content />
<SubmitButton />
`,s={package:t(n),formDefaults:{idBuilderPackage:e},files:{"src/lib/post.ts":r,"src/routes/data.remote.ts":i,"src/routes/+page.svelte":a,"src/routes/form-content.svelte":o},vite:{optimizeDeps:{exclude:[`@sjsf/form`,`@sjsf/sveltekit/rf/client`]}}};export{s as layer};