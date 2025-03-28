<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme } from "@sjsf/flowbite3-theme";
  import { specs } from '@sjsf/flowbite3-theme/specs'

  import { createAstro } from "@/astro.svelte";
  import { createMyForm } from "@/components/my-form";

  import { createSchemas } from "./_demo-schema";

  const astro = createAstro();

  const form = createMyForm({
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
