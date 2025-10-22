import{p as t}from"./package.wfED_5Uj.js";import{p as e}from"./post-model.DH7AMiqq.js";import{o as n}from"./advanced-examples.BMdL78Aj.js";import"./each.BEO3Vq6I.js";import"./render.BbHDAxyr.js";import"./definitions.iJbBEcx_.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CdzS3xvw.js";import"./shared.6XT6ak91.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DX8xHpeH.js";/* empty css                                                       *//* empty css                                                                 */const o=`import { fail, type Actions } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler, isValid } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/form-defaults";
import { type FormValue, schema } from "$lib/post-model";


export const load = async () => {
  return {
    // Should match action name
    form: {
      schema,
      initialValue: { title: "New post", content: "" } satisfies FormValue,
    } satisfies InitialFormData,
  };
};

const handleForm = createFormHandler({
  ...defaults,
  schema,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form, data, invalid] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!isValid<FormValue>(form, data)) {
      return fail(400, { form });
    }
    const { title, content } = data;
    if (title.length > 100) {
      return fail(400, {
        form: invalid([{ path: ["title"], message: "Title is too long" }]),
      });
    }
    // Your logic here
    return { form, post: { id: "new-post", title, content } };
  },
} satisfies Actions;
`,s=`<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onSuccess: (result) => {
      if (result.type === "success") {
        console.log(result.data?.post);
      }
    },
  });
<\/script>

<BasicForm {form} method="POST" />
`,h={package:n(t),files:{"src/lib/post-model.ts":e,"src/routes/+page.server.ts":o,"src/routes/+page.svelte":s}};export{h as layer};
