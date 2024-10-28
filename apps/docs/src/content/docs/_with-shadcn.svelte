<script lang="ts">
  import { Form } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme, setThemeContext } from "@sjsf/shadcn-theme";
  import { components } from '@sjsf/shadcn-theme/default'

  import { astroTheme } from "@/theme.svelte";

  import { schema, uiSchema, initialData } from "./_schema";
  import { validator } from "./_validator";

  let value = $state(initialData);

  const astro = astroTheme();

  setThemeContext({ components })
</script>

<Form
  class="flex flex-col gap-4 {astro.darkOrLight}"
  bind:value
  {...theme}
  {schema}
  {uiSchema}
  {validator}
  {translation}
  onSubmit={console.log}
/>

<pre style="padding-top: 1rem;">{JSON.stringify(value, null, 2)}</pre>
