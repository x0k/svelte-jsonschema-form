<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme } from "@sjsf/flowbite-theme";
  import { specs } from '@sjsf/flowbite-theme/specs'

  import { themeManager } from "@/theme.svelte";
  import * as defaults from "@/lib/sjsf/defaults";

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
  class="flex flex-col gap-4 mb-4 {themeManager.darkOrLight}"
/>

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
