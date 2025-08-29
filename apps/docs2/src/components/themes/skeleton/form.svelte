<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "../data";
  import * as defaults from "./defaults";

  const form = createForm({
    ...defaults,
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

<pre>{JSON.stringify(form.value, null, 2)}</pre>
