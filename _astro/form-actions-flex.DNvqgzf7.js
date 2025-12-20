import{p as t}from"./package.DexCkx4w.js";import{p as e}from"./post.DKNNhoEq.js";import{F as o}from"./shared.DBy_6Hme.js";import{o as r}from"./advanced-examples.C2pVl4J8.js";import"./each.DA8Iz3oH.js";import"./render.DgIpg5f0.js";import"./definitions.B_Fnfyhh.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.ClxrbVWC.js";import"./preload-helper.BUFao3bW.js";import"./buttons.By8qtqJP.js";/* empty css                                                       *//* empty css                                                                 */const n=`import { fail, type Actions } from "@sveltejs/kit";
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
`,s=`<script lang="ts">
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
`,y={package:r(t),formDefaults:{idBuilderPackage:o},files:{"src/lib/post.ts":e,"src/routes/+page.server.ts":n,"src/routes/+page.svelte":s}};export{y as layer};
