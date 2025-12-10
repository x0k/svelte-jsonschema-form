import{p as e}from"./package.BLgk3UUW.js";import{s as t}from"./server.C4rkF3Ut.js";import{F as r}from"./shared.D-qOJROC.js";import{o as n}from"./advanced-examples.CXS6TFrq.js";import"./each.6bordhHJ.js";import"./render.DX-iuavQ.js";import"./definitions.D_siw9_V.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.B-EJzUI_.js";import"./preload-helper.BUFao3bW.js";import"./buttons.BUF9oi55.js";/* empty css                                                       *//* empty css                                                                 */const a=`import { loadResults } from "$lib/server";

import type { LayoutServerLoad } from "./$types";

export const trailingSlash = "always";

export const load: LayoutServerLoad = async () => {
  return {
    results: await loadResults(),
  };
};
`,s=`<script lang="ts">
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
<\/script>

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
`,i=`import { error, fail, redirect, type Actions } from "@sveltejs/kit";
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
`,k={package:n(e),formDefaults:{idBuilderPackage:r},files:{"src/lib/server.ts":t,"src/routes/+layout.server.ts":a,"src/routes/+page.svelte":s,"src/routes/[id]/+page.server.ts":i,"src/routes/[id]/+page.svelte":o}};export{k as layer};
