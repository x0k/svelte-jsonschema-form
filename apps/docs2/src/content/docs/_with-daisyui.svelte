<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/daisyui-theme";
  import "@sjsf/daisyui-theme/extra-widgets/textarea-include";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { validator } from "./_validator";
  import { onSubmit } from "./_on-submit";

  const astro = createAstro();

  const form = createForm({
    theme,
    initialValue,
    schema,
    uiSchema,
    validator,
    translation,
    onSubmit,
  });
</script>

<BasicForm
  {form}
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
