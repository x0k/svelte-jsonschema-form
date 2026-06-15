<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import { getValueByKeys } from "@sjsf/form/lib/trie";

  import { getTabsContext } from "./context.svelte";

  const { children, config }: ComponentProps["layout"] = $props();
  const tabsCtx = getTabsContext();

  const node = getValueByKeys(tabsCtx.current, config.path.slice(0, -1));
  node?.tabs.push(children);
</script>
