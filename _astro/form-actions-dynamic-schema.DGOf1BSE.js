import{t as e}from"./shared.B9p8RNJ6.js";import{a as t}from"./layer.CUzcRAm9.js";import{t as n}from"./package.Dc7N-i8T.js";import{t as r}from"./server.C5fs_cc5.js";var i=`import { loadResults } from "$lib/server";

import type { LayoutServerLoad } from "./$types";

export const trailingSlash = "always";

export const load: LayoutServerLoad = async () => {
  return {
    results: await loadResults(),
  };
};
`,a=`<script lang="ts">
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
<\/script>

<!-- NOTE: \`data-sveltekit-reload\` is used to avoid an issue with async Svelte -->
<div class="center" data-sveltekit-reload>
  <a href="./foo">Foo form</a>
  <a href="./bar">Bar form</a>
  <p>Results:</p>
  <pre><code>{JSON.stringify(data.results, null, 2)}</code></pre>
</div>

<style>
  .center {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
</style>
`,o=`<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit/client";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
<\/script>

<SvelteKitForm
  {...defaults}
  {meta}
  idBuilder={createFormIdBuilder}
  uiSchema={{
    "ui:options": {
      form: {
        novalidate: true,
      },
    },
  }}
/>
`,s=`import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";

import { loadSchemaById, saveResult } from "$lib/server";
import * as defaults from "$lib/form-defaults";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const schema = await loadSchemaById(params.id);
  if (schema === undefined) {
    error(404);
  }
  return {
    form: {
      schema,
    } satisfies InitialFormData<unknown>,
  };
};

export const actions = {
  default: async ({ request, params }) => {
    const schema = params.id && (await loadSchemaById(params.id));
    if (!schema) {
      error(404);
    }
    const [form] = await createFormHandler({
      ...defaults,
      schema,
      sendData: true,
    })(request.signal, await request.formData());
    if (!form.isValid) {
      return fail(400, { form });
    }
    await saveResult(form.data);
    redirect(303, "..");
  },
} satisfies Actions;
`,c={package:t(n),formDefaults:{idBuilderPackage:e},files:{"src/lib/server.ts":r,"src/routes/+layout.server.ts":i,"src/routes/+page.svelte":a,"src/routes/[id]/+page.server.ts":s,"src/routes/[id]/+page.svelte":o}};export{c as layer};