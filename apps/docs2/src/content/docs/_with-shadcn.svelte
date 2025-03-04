<script lang="ts">
  import { RawForm, createForm3 } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme, setThemeContext } from "@sjsf/shadcn-theme";
  import { components } from "@sjsf/shadcn-theme/default";

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

  setThemeContext({ components });
</script>

<RawForm {form} class="flex flex-col gap-4 {astro.darkOrLight}" />

<pre style="padding-top: 1rem;">{JSON.stringify(form.value, null, 2)}</pre>
