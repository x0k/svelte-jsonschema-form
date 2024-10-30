<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { theme, setThemeContext } from "@sjsf/shadcn-theme";
  import { components } from "@sjsf/shadcn-theme/default";

  import { useAstro } from "@/astro.svelte";
  import { useCustomForm } from "@/components/custom-form";

  import { schema, uiSchema } from "./_demo-schema";

  const astro = useAstro();

  const form = useCustomForm({
    ...theme,
    schema,
    uiSchema,
  });

  setThemeContext({ components });
</script>

<SimpleForm {form} novalidate class="flex flex-col gap-4 {astro.darkOrLight}" />

<pre style="padding-top: 1rem;">{JSON.stringify(form.value, null, 2)}</pre>
