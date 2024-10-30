<script lang="ts">
  import { SimpleForm, useForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/skeleton-theme";

  import { useAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { validator } from "./_validator";

  const astro = useAstro();

  const form = useForm({
    ...theme,
    initialValue,
    schema,
    uiSchema,
    validator,
    translation,
  });
</script>

<SimpleForm
  {form}
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
