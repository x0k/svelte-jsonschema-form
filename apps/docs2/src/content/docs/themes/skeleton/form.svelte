<script lang="ts">
  import { BasicForm, createForm } from '@sjsf/form';
  import { theme } from "@sjsf/skeleton-theme";
  import { specs } from '@sjsf/skeleton-theme/specs'

  import { createAstro } from "@/astro.svelte";
  import * as defaults from "@/lib/form/defaults";

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
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
