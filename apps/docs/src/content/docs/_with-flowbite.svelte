<script lang="ts">
  import { FormBase, getDefaultFormState } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/flowbite-theme";

  import { astroTheme } from "@/theme.svelte";

  import { schema, uiSchema, initialData } from "./_schema";
  import { validator } from "./_validator";

  let value = $state(getDefaultFormState(validator, schema, initialData));

  const astro = astroTheme();
</script>

<FormBase
  class="flex flex-col gap-4 mb-4 {astro.darkOrLight}"
  bind:value
  {...theme}
  {schema}
  {uiSchema}
  {validator}
  {translation}
  onSubmit={console.log}
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
