<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme } from "@sjsf-lab/beercss-theme";
  import { specs } from "@sjsf-lab/beercss-theme/specs";

  import { createAstro } from "@/astro.svelte";
  import * as defaults from "@/lib/form/defaults";

  import { createSchemas } from "../../_demo-schema";

  const astro = createAstro();

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm {form} novalidate class={astro.darkOrLight} />

<pre class={astro.darkOrLight}>{JSON.stringify(
    getValueSnapshot(form),
    null,
    2
  )}</pre>
