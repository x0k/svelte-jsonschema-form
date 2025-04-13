<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme } from "@sjsf/daisyui5-theme";
  import { specs } from "@sjsf/daisyui5-theme/specs";

  import { createAstro } from "@/astro.svelte";
  import { createMyForm } from "@/components/my-form";

  import { createSchemas } from "../_demo-schema";

  const astro = createAstro();

  const form = createMyForm({
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
