import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{a as t,c as n,i as r,n as i,r as a}from"./model.B98gGsUz.js";import{t as o}from"./server.VN4yoodA.js";var s=`export const trailingSlash = "always";
`,c=`<script lang="ts">
  import { getResults } from "./data.remote";

  const results = $derived(await getResults());
<\/script>

<div class="center">
  <a href="./foo">Foo form</a>
  <a href="./bar">Bar form</a>
  <p>Results:</p>
  <pre><code>{JSON.stringify(results, null, 2)}</code></pre>
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
`,l=`<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import { page } from "$app/state";
  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createResult, getCurrentSchema } from "../data.remote";

  const schema = await getCurrentSchema(page.params.id);

  const form = createForm(
    await connect(createResult, {
      ...defaults,
      schema,
    })
  );
<\/script>

<BasicForm {form} novalidate />
`,u=`import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { error, invalid, redirect } from "@sveltejs/kit";

import { form, getRequestEvent, query } from "$app/server";
import { loadResults, loadSchemaById, saveResult } from "$lib/server";
import * as defaults from "$lib/sjsf/remote-defaults";

export const getResults = query(loadResults);

export const getCurrentSchema = query("unchecked", async (id) => {
  const schema = typeof id === "string" && (await loadSchemaById(id));
  if (!schema) {
    error(404);
  }
  return schema;
});

export const createResult = form("unchecked", async (data) => {
  const { params } = getRequestEvent();
  const schema = params.id && (await loadSchemaById(params.id));
  if (!schema) {
    error(404);
  }
  const validator = createServerValidator({
    ...defaults,
    schema,
  });
  const result = await validator.validate(data);
  if (result.issues) {
    invalid(...result.issues);
  }
  await saveResult(result.value.data);
  await getResults().refresh();
  redirect(303, "..");
});
`,d=e({default:()=>p,meta:()=>f}),f=t({category:i.SvelteKitIntegrations,title:`Remote Functions Dynamic Schema`,description:`Dynamic schemas combined with SvelteKit remote functions.`,tags:[a.RemoteFunctions]}),p=r({sveltekit:`remoteFunctions`,files:{"src/lib/server.ts":o,"src/routes/+layout.ts":s,"src/routes/+page.svelte":c,"src/routes/data.remote.ts":u,"src/routes/[id]/+page.svelte":l},codeTransformers:[n]});export{d as n,f as t};