import{p as t}from"./package.3ViDar0W.js";import{p as e}from"./post.DKNNhoEq.js";import{a as r}from"./shared.Dt5juWKd.js";import{o}from"./advanced-examples.DMsG3v_S.js";import"./each.BERe9yIu.js";import"./render.B5rVQQAv.js";import"./definitions.DM0KYeNY.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.Bu_s7wcY.js";import"./preload-helper.BUFao3bW.js";import"./buttons.BWwP8odj.js";/* empty css                                                       *//* empty css                                                                 */const i=`import { invalid } from '@sveltejs/kit';
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
  import { tick } from "svelte";
  import { BasicForm, createForm } from "@sjsf/form";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/form-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  const form = createForm(
    await connect(
      createPost.enhance(async ({ submit }) => {
        await submit();
        if (createPost.fields.allIssues()) {
          return;
        }
        console.log(createPost.result);
        // Waiting for an update from remote function
        await tick();
        form.reset();
      }),
      {
        ...defaults,
        ...initialData,
        idBuilder: createFormIdBuilder,
        // Required due to the use of \`enhance\`
        fields: createPost.fields,
      }
    )
  );
<\/script>

<BasicForm {form} novalidate />
`,D={package:o(t),formDefaults:{idBuilderPackage:r},files:{"src/lib/post.ts":e,"src/routes/data.remote.ts":i,"src/routes/+page.svelte":a},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{D as layer};
