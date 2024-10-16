<script lang="ts">
  import { theme } from "@sjsf/skeleton-theme";

  import { astroTheme } from "@/theme.svelte";
  import CustomForm from "@/components/custom-form.svelte";

  import { schema, uiSchema } from "./_demo-schema";

  const astro = astroTheme();

  let value = $state();
</script>

<CustomForm
  {...theme}
  bind:value
  {schema}
  {uiSchema}
  novalidate
  onSubmit={console.log}
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
  data-theme="cerberus"
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
