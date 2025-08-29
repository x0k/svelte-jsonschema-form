<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "../data";
  import * as defaults from "./defaults";

  const form = createForm({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "daisyui5",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
  });
  const astro = createAstro();
</script>

<BasicForm
  {form}
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
