<script lang="ts">
  import type { ComponentProps } from '@sjsf/form';
  
  import { getTabsContext } from './context.svelte';

  const { children }: ComponentProps["layout"] = $props();

  const tabsCtx = getTabsContext()

  tabsCtx.tabs.push(children)
</script>
