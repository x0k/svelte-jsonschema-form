<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { resolver } from '@sjsf/form/resolvers/basic'
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/skeleton-theme";
  import "@sjsf/skeleton-theme/extra-widgets/textarea-include";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { createValidator } from "./_validator";
  import { onSubmit } from "./_on-submit";

  const astro = createAstro();

  const form = createForm({
    idPrefix: "skeleton",
    validator: createValidator("skeleton"),
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
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
