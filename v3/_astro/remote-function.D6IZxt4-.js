import{p as t}from"./package.DFQJTP9F.js";import{p as e}from"./post-model.DH7AMiqq.js";import{o as r}from"./advanced-examples.BZW7Ids9.js";import"./each.B6EQyiei.js";import"./render.p9uU9aNd.js";import"./definitions.CQdNrImE.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CRTjy3CY.js";import"./shared.D29q2wXs.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CoMtafGT.js";/* empty css                                                       *//* empty css                                                                 */const o=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createServerValidator } from "@sjsf/sveltekit/rf/server";

import { form, query } from "$app/server";
import * as defaults from "$lib/form-defaults";
import { schema, type FormValue } from "$lib/post-model";

export const getInitialData = query(async () => {
  return {
    schema,
    initialValue: { title: "New post", content: "" } satisfies FormValue,
  } satisfies InitialFormData;
});

export const createPost = form(
  createServerValidator<FormValue>({
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
`,n=`<script lang="ts">
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
`,k={package:r(t),files:{"src/lib/post-model.ts":e,"src/routes/data.remote.ts":o,"src/routes/+page.svelte":n},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{k as layer};
