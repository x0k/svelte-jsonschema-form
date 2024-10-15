<script lang="ts">
  import { theme } from "@sjsf/flowbite-theme";

  import { astroTheme } from "@/theme.svelte";
  import { CustomForm } from "@/components/custom-form";

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
  class="flex flex-col gap-4 mb-4 {astro.darkOrLight}"
/>

<pre>{JSON.stringify(value, null, 2)}</pre>
