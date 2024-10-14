<script lang="ts">
  import { theme } from "@sjsf/daisyui-theme";

  import { astroTheme } from "@/theme.svelte";
  import CustomForm from "@/components/custom-form.svelte";

  import { schema, uiSchema } from "./_demo-schema";

  const astro = astroTheme();

  let value = $state()
</script>

<CustomForm
  {...theme}
  bind:value
  {schema}
  {uiSchema}
  novalidate
  onSubmit={console.log}
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={astro.darkOrLight}
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
