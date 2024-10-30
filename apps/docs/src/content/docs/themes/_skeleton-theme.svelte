<script lang="ts">
  import { SimpleForm } from '@sjsf/form';
  import { theme } from "@sjsf/skeleton-theme";

  import { useAstro } from "@/astro.svelte";
  import { useCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from "./_demo-schema";

  const astro = useAstro();

  const form = useCustomForm({
    ...theme,
    schema,
    uiSchema,
  });
</script>

<SimpleForm
  {form}
  novalidate
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
