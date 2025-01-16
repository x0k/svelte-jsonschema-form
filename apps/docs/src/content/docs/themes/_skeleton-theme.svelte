<script lang="ts">
  import { RawForm } from '@sjsf/form';
  import { theme } from "@sjsf/skeleton-theme";

  import { useAstro } from "@/astro.svelte";
  import { createCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from "./_demo-schema";

  const astro = useAstro();

  const form = createCustomForm({
    ...theme,
    schema,
    uiSchema,
  });
</script>

<RawForm
  {form}
  novalidate
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
