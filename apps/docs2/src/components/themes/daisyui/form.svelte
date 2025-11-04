<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";

  import { createAstro } from "@/astro.svelte";

  import {
    schema,
    uiSchema,
    initialValue,
    withFile,
    type CreateUser,
  } from "../data";
  import * as defaults from "./defaults";

  const form = createForm<CreateUser>({
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

<pre>{JSON.stringify(getValueSnapshot(form), withFile, 2)}</pre>
