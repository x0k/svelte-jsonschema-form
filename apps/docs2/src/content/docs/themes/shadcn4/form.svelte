<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { theme, setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import { specs } from "@sjsf/shadcn4-theme/specs";
  import { BitsConfig } from "bits-ui";

  import { createAstro } from "@/astro.svelte";
  import { createMyForm } from "@/components/my-form";

  import { createSchemas } from "../_demo-schema";

  const astro = createAstro();

  const form = createMyForm({
    ...createSchemas(specs),
    theme,
  });

  setThemeContext({ components });

  let portalEl = $state.raw() as HTMLDivElement;
</script>

<BitsConfig defaultPortalTo={portalEl}>
  <BasicForm
    {form}
    novalidate
    class="flex flex-col gap-4 {astro.darkOrLight}"
    style="margin-bottom: 1rem;"
  />
</BitsConfig>
<div bind:this={portalEl}></div>

<pre>{JSON.stringify(form.value, null, 2)}</pre>
