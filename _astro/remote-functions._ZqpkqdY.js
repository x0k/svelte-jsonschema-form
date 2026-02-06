import{p as t}from"./package.hp1iCy8g.js";import{p as e}from"./post.DKNNhoEq.js";import{a as r}from"./shared.B_s6gM3W.js";import{o}from"./advanced-examples.DCY8CaJZ.js";import"./each.Cjw3fkz9.js";import"./render.bjje8vhp.js";import"./definitions.CJzjw8-U.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.nY02T5g5.js";import"./preload-helper.BUFao3bW.js";import"./buttons.B3JiliPT.js";/* empty css                                                       *//* empty css                                                                 */const i=`import { invalid } from '@sveltejs/kit';
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
