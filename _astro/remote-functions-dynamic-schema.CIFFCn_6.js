import{p as e}from"./package.Cgrt83H6.js";import{s as t}from"./server.C4rkF3Ut.js";import{a as r}from"./shared.vk0nOusO.js";import{o as s}from"./advanced-examples.JNG0ujKV.js";import"./each.E2M9YBNN.js";import"./render.BuB-hVQN.js";import"./definitions.CTDKHaM0.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.qsOdrog_.js";import"./preload-helper.BUFao3bW.js";import"./buttons.InKbrNqz.js";/* empty css                                                       *//* empty css                                                                 */const a='export const trailingSlash = "always";',n=`<script lang="ts">
  import { getResults } from './data.remote';

  const results = $derived(await getResults())
<\/script>

<div class="center" data-sveltekit-reload>
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
`,o=`import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { error, invalid, redirect } from "@sveltejs/kit";

import { form, getRequestEvent, query } from "$app/server";
import { loadResults, loadSchemaById, saveResult } from "$lib/server";
import * as defaults from "$lib/form-defaults";

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
`,i=`<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  // WARN: You must export this ID Builder in your \`defaults\` file
  import { createFormIdBuilder } from "@sjsf/sveltekit/rf";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import { page } from '$app/state'

  import * as defaults from "$lib/form-defaults";

  import { createResult, getCurrentSchema } from "../data.remote";

  const schema = await getCurrentSchema(page.params.id);

  const form = createForm(
    await connect(createResult, {
      ...defaults,
      schema,
      idBuilder: createFormIdBuilder,
    })
  );
<\/script>

<BasicForm {form} novalidate />
`,k={package:s(e),formDefaults:{idBuilderPackage:r},files:{"src/lib/server.ts":t,"src/routes/+layout.ts":a,"src/routes/+page.svelte":n,"src/routes/data.remote.ts":o,"src/routes/[id]/+page.svelte":i},vite:{optimizeDeps:{exclude:["@sjsf/form","@sjsf/sveltekit/rf/client"]}}};export{k as layer};
