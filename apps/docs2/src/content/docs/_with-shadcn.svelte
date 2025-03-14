<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { theme, setThemeContext } from "@sjsf/shadcn-theme";
  import { components } from "@sjsf/shadcn-theme/default";
  import "@sjsf/shadcn-theme/extra-widgets/textarea-include";

  import { createAstro } from "@/astro.svelte";

  import { schema, uiSchema, initialValue } from "./_schema";
  import { createValidator } from "./_validator";
  import { onSubmit } from "./_on-submit";

  const idPrefix = "shadcn";
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

  setThemeContext({ components });
</script>

<BasicForm {form} class="flex flex-col gap-4 {astro.darkOrLight}" />

<pre style="padding-top: 1rem;">{JSON.stringify(form.value, null, 2)}</pre>
