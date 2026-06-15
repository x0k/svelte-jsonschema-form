<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme } from "@sjsf/basic-theme";
  import { specs } from "@sjsf/basic-theme/specs";

  import * as defaults from "@/lib/sjsf/defaults";
  import { themeManager } from "@/theme.svelte";

  import { createSchemas } from "../_demo-schema";

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm {form} novalidate data-theme={themeManager.darkOrLight} />

<pre data-theme={themeManager.darkOrLight}>{JSON.stringify(
    getValueSnapshot(form),
    null,
    2
  )}</pre>
