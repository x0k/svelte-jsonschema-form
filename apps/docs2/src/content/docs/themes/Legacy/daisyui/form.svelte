<script lang="ts">
  import { theme } from "@sjsf/daisyui-theme";
  import { specs } from "@sjsf/daisyui-theme/specs";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";

  import * as defaults from "@/lib/sjsf/defaults";
  import { themeManager } from "@/theme.svelte";

  import { createSchemas } from "../../_demo-schema";

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });
</script>

<BasicForm
  {form}
  novalidate
  style="background-color: transparent; margin-bottom: 1rem;"
  data-theme={themeManager.darkOrLight}
/>

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
