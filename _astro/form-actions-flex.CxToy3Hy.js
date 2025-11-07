import{p as t}from"./package.Du9ne4uO.js";import{p as e}from"./post.DKNNhoEq.js";import{o}from"./advanced-examples.Nx72fBox.js";import"./each.BC0dbH8N.js";import"./render.DxLQKmJN.js";import"./definitions.DJcsTpNp.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.BL4UIDmo.js";import"./shared.DWFaaLFU.js";import"./preload-helper.BUFao3bW.js";import"./buttons.DaY576ra.js";/* empty css                                                       *//* empty css                                                                 */const n=`import { fail, type Actions } from "@sveltejs/kit";
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
`,r=`<script lang="ts">
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
`,F={package:o(t),files:{"src/lib/post.ts":e,"src/routes/+page.server.ts":n,"src/routes/+page.svelte":r}};export{F as layer};
