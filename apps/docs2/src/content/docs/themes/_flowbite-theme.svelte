<script lang="ts">
  import { RawForm } from "@sjsf/form";
  import { theme } from "@sjsf/flowbite-theme";

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
  class="flex flex-col gap-4 mb-4 {astro.darkOrLight}"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
