import{n as e}from"./shared.DZgb-PNL.js";import{a as t}from"./layer.D0xDDSxh.js";import{t as n}from"./package.DlxU5c04.js";import{t as r}from"./server.GyF-VtQ6.js";var i={package:t(n),formDefaults:{idBuilderPackage:e},files:{"src/lib/server.ts":r,"src/routes/+layout.ts":`export const trailingSlash = "always";`,"src/routes/+page.svelte":`<script lang="ts">
  import { getResults } from './data.remote';

  const results = $derived(await getResults())
<\/script>

<!-- NOTE: \`data-sveltekit-reload\` is used to avoid an issue with async Svelte -->
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
`,"src/routes/data.remote.ts":`import { createServerValidator } from "@sjsf/sveltekit/rf/server";
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
`,"src/routes/[id]/+page.svelte":`<script lang="ts">
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
`},vite:{optimizeDeps:{exclude:[`@sjsf/form`,`@sjsf/sveltekit/rf/client`]}}};export{i as layer};