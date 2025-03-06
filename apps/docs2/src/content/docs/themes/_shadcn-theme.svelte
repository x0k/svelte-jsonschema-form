<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme, setThemeContext } from "@sjsf/shadcn-theme";
  import { components } from "@sjsf/shadcn-theme/default";

  import { createAstro } from "@/astro.svelte";
  import { createMyForm } from "@/components/my-form";

  import { schema, uiSchema } from "./_demo-schema";

  const astro = createAstro();

  const form = createMyForm({
    theme,
    schema,
    uiSchema,
  });

  setThemeContext({ components });
</script>

<BasicForm
  {form}
  novalidate
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
/>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
