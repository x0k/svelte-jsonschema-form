import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{a as t,i as n,n as r,r as i}from"./model.UVZZgLR2.js";import{t as a}from"./server.VN4yoodA.js";var o=`import { loadResults } from "$lib/server";

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

<div class="center">
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
`,c=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";

import { loadSchemaById, saveResult } from "$lib/server";
import * as defaults from "$lib/sjsf/defaults";

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
`,l=`<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
<\/script>

<SvelteKitForm
  {...defaults}
  {meta}
  uiSchema={{
    "ui:options": {
      form: {
        novalidate: true,
      },
    },
  }}
/>
`,u=e({default:()=>f,meta:()=>d}),d=t({category:r.SvelteKitIntegrations,title:`Form Actions Dynamic Schema`,description:`Dynamic schemas combined with SvelteKit form actions.`,tags:[i.FormActions]}),f=n({sveltekit:`formActions`,files:{"src/lib/server.ts":a,"src/routes/+layout.server.ts":o,"src/routes/+page.svelte":s,"src/routes/[id]/+page.server.ts":c,"src/routes/[id]/+page.svelte":l}});export{d as n,u as t};