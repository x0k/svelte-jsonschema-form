<script lang="ts">
  import type { ComponentProps } from '@sjsf/form';
  
  import { getTabsNodeContext } from './context.svelte';

  const { children }: ComponentProps["layout"] = $props();
  const node = getTabsNodeContext()

  node.tabs.push(children)
</script>
