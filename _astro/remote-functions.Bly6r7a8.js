import{p as t}from"./package.Du9ne4uO.js";import{p as e}from"./post.DKNNhoEq.js";import{o as r}from"./advanced-examples.CxzyEp1g.js";import"./each.C_j-bgU5.js";import"./render.BriTjfDz.js";import"./definitions.Ba1XsyYK.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.1bGkIM3E.js";import"./shared.BelUoCWQ.js";import"./preload-helper.BUFao3bW.js";import"./buttons.BJuL6vbc.js";/* empty css                                                       *//* empty css                                                                 */const n=`import type { InitialFormData } from "@sjsf/sveltekit";
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
    return { id: "new-post", title, content };
  }
);
`,o=`<script lang="ts">
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
`,P={package:r(t),files:{"src/lib/post.ts":e,"src/routes/data.remote.ts":n,"src/routes/+page.svelte":o},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{P as layer};
