<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { theme } from "@sjsf/daisyui-theme";
  import { specs } from '@sjsf/daisyui-theme/specs'

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
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
