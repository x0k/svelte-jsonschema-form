<script lang="ts">
  import { insertValue } from "@sjsf/form/lib/trie";
  import {
    getFieldTitle,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  import { createTabsNode, getTabsContext } from "./context.svelte";

  const { config, children }: ComponentProps["layout"] = $props();

  const ctx = getFormContext();
  const tabsCtx = getTabsContext();
  const node = createTabsNode(0);
  tabsCtx.current = insertValue(tabsCtx.current, config.path, node);

  function getTabTitle(i: number): string {
    return getFieldTitle(ctx, config.path.concat(i)) ?? `Tab ${i + 1}`;
  }
</script>

{@render children()}

<div style="display: flex; gap: 1rem;">
  {#each node.tabs as _, i}
    <button
      style="width: 100%;"
      onclick={(e) => {
        e.preventDefault();
        node.selectedTab = i;
      }}
    >
      {getTabTitle(i)}
      {#if node.selectedTab === i}
        (selected)
      {/if}
    </button>
  {/each}
</div>

{#each node.tabs as tab, i}
  <div style:display={node.selectedTab === i ? "unset" : "none"}>
    {@render tab()}
  </div>
{/each}

<!-- Or render only selected tab -->

<!-- {#if tabs.length > 0}
  {@render tabs[selectedTab]()}
{/if} -->
