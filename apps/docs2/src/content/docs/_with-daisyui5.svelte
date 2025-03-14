<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/daisyui5-theme";
  import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { createValidator } from "./_validator";
  import { onSubmit } from "./_on-submit";

  const astro = createAstro();

  const form = createForm({
    idPrefix: "daisyui5",
    validator: createValidator('daisyui5'),
    resolver,
    theme,
    initialValue,
    schema,
    uiSchema,
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
