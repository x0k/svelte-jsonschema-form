<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme, setThemeContext } from "@sjsf/shadcn-theme";
  import * as components from "@sjsf/shadcn-theme/default";
  import { specs } from '@sjsf/shadcn-theme/specs'

  import { createAstro } from "@/astro.svelte";
  import * as defaults from "@/lib/form/defaults";

  import { createSchemas } from "../../_demo-schema";

  const astro = createAstro();

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });

  setThemeContext({ components });
</script>

<BasicForm
  {form}
  novalidate
  class="flex flex-col gap-4 {astro.darkOrLight}"
  style="margin-bottom: 1rem;"
/>

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
