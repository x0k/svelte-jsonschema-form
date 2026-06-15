<script lang="ts">
  import { theme } from "@sjsf-lab/beercss-theme";
  import { specs } from "@sjsf-lab/beercss-theme/specs";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";

  import * as defaults from "@/lib/sjsf/defaults";
  import { themeManager } from "@/theme.svelte";

  import { createSchemas } from "../_demo-schema";

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm {form} novalidate class={themeManager.darkOrLight} />

<pre class={themeManager.darkOrLight}>{JSON.stringify(
    getValueSnapshot(form),
    null,
    2
  )}</pre>
