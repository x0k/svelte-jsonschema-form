<script lang="ts">
  import { Form } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { theme } from "@sjsf/daisyui-theme";

  import { astroTheme } from "@/theme.svelte";

  import { schema, uiSchema, initialData } from "./_schema";
  import { validator } from './_validator'

  let value = $state(initialData);

  const astro = astroTheme();
</script>

<Form
  style="background-color: transparent; margin-bottom: 1rem;"
  bind:value
  {...theme}
  {schema}
  {uiSchema}
  {validator}
  {translation}
  data-theme={astro.darkOrLight}
  onSubmit={console.log}
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
