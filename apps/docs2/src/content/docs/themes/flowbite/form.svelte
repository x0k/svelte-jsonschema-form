<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { theme } from "@sjsf/flowbite-theme";
  import { specs } from '@sjsf/flowbite-theme/specs'

  import { createAstro } from "@/astro.svelte";
  import * as defaults from "@/components/form-defaults";

  import { createSchemas } from "../_demo-schema";

  const astro = createAstro();

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm
  {form}
  novalidate
  class="flex flex-col gap-4 mb-4 {astro.darkOrLight}"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
