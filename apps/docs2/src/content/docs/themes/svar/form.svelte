<script lang="ts">
  import { Willow, WillowDark } from '@svar-ui/svelte-core'
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { theme } from "@sjsf-lab/svar-theme";
  import { specs } from '@sjsf-lab/svar-theme/specs';

  import * as defaults from "@/lib/sjsf/defaults";
  import { themeManager } from '@/theme.svelte';

  import { createSchemas } from "../_demo-schema";

  
  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
  });

  const Theme = $derived(themeManager.darkOrLight === 'dark' ? WillowDark : Willow)
</script>

<div>
  <Theme>
    <BasicForm {form} novalidate />
  </Theme>
</div>

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>

<style>
  div > :global(*) {
    background-color: transparent;
  }
</style>