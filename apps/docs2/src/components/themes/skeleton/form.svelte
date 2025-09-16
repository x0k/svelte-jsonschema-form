<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { createAstro } from "@/astro.svelte";

  import {
    schema,
    uiSchema,
    initialValue,
    type Data,
    withFile,
  } from "../data";
  import * as defaults from "./defaults";

  const form = createForm({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "skeleton3",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }: Data) => window.alert(`Hello, ${name}`),
  });
  const astro = createAstro();
</script>

<BasicForm
  {form}
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(form.value, withFile, 2)}</pre>
