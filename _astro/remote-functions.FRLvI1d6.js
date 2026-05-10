import{n as e}from"./shared.THKocspZ.js";import{a as t}from"./layer.CYwf_3o2.js";import{t as n}from"./package.C5YcBZre.js";import{t as r}from"./post.Dupxwtuc.js";var i={package:t(n),formDefaults:{idBuilderPackage:e},files:{"src/lib/post.ts":r,"src/routes/data.remote.ts":`import { invalid } from "@sveltejs/kit";
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
  },
);
`,"src/routes/+page.svelte":`<script lang="ts">
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
`},vite:{optimizeDeps:{exclude:[`@sjsf/form`,`@sjsf/sveltekit/rf/client`]}}};export{i as layer};