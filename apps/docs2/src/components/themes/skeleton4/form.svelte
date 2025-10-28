<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";

  import { createAstro } from "@/astro.svelte";

  import {
    schema,
    uiSchema,
    initialValue,
    type Data,
    withFile,
  } from "../data";
  import * as defaults from "./defaults";

  const form = createForm<Data>({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "skeleton4",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
  });
  const astro = createAstro();
</script>

<BasicForm
  {form}
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(getValueSnapshot(form), withFile, 2)}</pre>
