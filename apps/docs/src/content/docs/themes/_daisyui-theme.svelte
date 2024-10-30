<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { theme } from "@sjsf/daisyui-theme";

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
  style="display: flex; flex-direction: column; gap: 1rem; background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
