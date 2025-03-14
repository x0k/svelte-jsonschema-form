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

  const idPrefix = "daisyui5";
  const validator = createValidator(idPrefix);
  const form = createForm({
    idPrefix,
    validator,
    resolver,
    theme,
    initialValue,
    schema,
    uiSchema,
    translation,
    onSubmit,
  });
  const astro = createAstro();
</script>

<BasicForm
  {form}
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
