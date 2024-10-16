<script lang="ts">
  import { Form } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/skeleton-theme";

  import { astroTheme } from "@/theme.svelte";

  import { schema, uiSchema, initialData } from "./_schema";
  import { validator } from "./_validator";

  let value = $state(initialData);

  const astro = astroTheme();
</script>

<Form
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  bind:value
  {...theme}
  {schema}
  {uiSchema}
  {validator}
  {translation}
  data-theme="cerberus"
  onSubmit={console.log}
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
