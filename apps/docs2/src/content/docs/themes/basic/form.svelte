<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme } from "@sjsf/basic-theme";
  import { specs } from "@sjsf/basic-theme/specs";

  import * as defaults from "@/lib/form/defaults";
  import { createAstro } from "@/astro.svelte";

  import { createSchemas } from "../_demo-schema";

  const astro = createAstro();

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm {form} novalidate data-theme={astro.darkOrLight} />

<pre data-theme={astro.darkOrLight}>{JSON.stringify(
    getValueSnapshot(form),
    null,
    2
  )}</pre>
