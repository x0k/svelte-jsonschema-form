<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/flowbite3-theme";
  import "@sjsf/flowbite3-theme/extra-widgets/textarea-include";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { createValidator } from "./_validator";
  import { onSubmit } from "./_on-submit";

  const idPrefix = "flowbite3";
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

<BasicForm {form} class="flex flex-col gap-4 mb-4 {astro.darkOrLight}" />

<pre>{JSON.stringify(form.value, null, 2)}</pre>
