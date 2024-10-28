<script lang="ts">
  import { theme, setThemeContext } from "@sjsf/shadcn-theme";
  import { components } from '@sjsf/shadcn-theme/default'

  import { astroTheme } from "@/theme.svelte";
  import CustomForm from "@/components/custom-form.svelte";

  import { schema, uiSchema } from "./_demo-schema";

  const astro = astroTheme();

  let value = $state();

  setThemeContext({ components })
</script>

<CustomForm
  {...theme}
  bind:value
  {schema}
  {uiSchema}
  novalidate
  onSubmit={console.log}
  class="flex flex-col gap-4 {astro.darkOrLight}"
/>

<pre style="padding-top: 1rem;">{JSON.stringify(value, null, 2)}</pre>
