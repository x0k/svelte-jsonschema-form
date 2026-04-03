import{t as e}from"./shared.B9p8RNJ6.js";import{a as t}from"./layer.CUzcRAm9.js";import{t as n}from"./package.Dc7N-i8T.js";import{t as r}from"./post.BTN9G2hY.js";var i=`import { fail, type Actions } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";
import { type CreatePost, schema } from "$lib/post";

export const load = async () => {
  return {
    // Should match action name
    form: {
      schema,
      initialValue: { title: "New post", content: "" },
    } satisfies InitialFormData<CreatePost>,
  };
};

const handleForm = createFormHandler<CreatePost, true>({
  ...defaults,
  schema,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form, , invalid] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!form.isValid) {
      return fail(400, { form });
    }
    const { title, content } = form.data;
    if (title.length > 100) {
      return fail(400, {
        form: invalid([{ path: ["title"], message: "Title is too long" }]),
      });
    }
    // Your logic here
    return { form, post: { id: "new-post", title, content } };
  },
} satisfies Actions;
`,a=`<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    idBuilder: createFormIdBuilder,
    onSuccess: (result) => {
      if (result.type === "success") {
        console.log(result.data?.post);
      }
    },
  });
<\/script>

<BasicForm {form} method="POST" />
`,o={package:t(n),formDefaults:{idBuilderPackage:e},files:{"src/lib/post.ts":r,"src/routes/+page.server.ts":i,"src/routes/+page.svelte":a}};export{o as layer};