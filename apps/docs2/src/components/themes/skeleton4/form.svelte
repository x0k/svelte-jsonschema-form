<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot, type ExtraUiOptions } from "@sjsf/form";

  import { createAstro } from "@/astro.svelte";

  import {
    schema,
    uiSchema,
    initialValue,
    type CreateUser,
    withFile,
  } from "../data";
  import * as defaults from "./defaults";

  const { extraUiOptions }: { extraUiOptions: ExtraUiOptions } = $props()

  const form = createForm<CreateUser>({
    ...defaults,
    // required due to several forms on the page
    idPrefix: "skeleton4",
    initialValue,
    schema,
    uiSchema,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
    extraUiOptions,
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
