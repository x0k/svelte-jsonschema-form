<script lang="ts">
  import { SimpleForm, createForm3 } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/daisyui-theme";

  import { useAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { validator } from "./_validator";
  import { onSubmit } from "./_on-submit";

  const astro = useAstro();

  const form = createForm3({
    ...theme,
    initialValue,
    schema,
    uiSchema,
    validator,
    translation,
    onSubmit,
  });
</script>

<SimpleForm
  {form}
  style="background-color: transparent; margin-bottom: 1rem;"
  class="flex flex-col gap-4"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
