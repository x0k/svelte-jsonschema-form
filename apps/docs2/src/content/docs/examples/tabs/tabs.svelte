<script lang="ts">
  import { isSchema } from "@sjsf/form/core";
  import type { ComponentProps } from "@sjsf/form";

  import {
    createTabsNode,
    getTabsContext,
    setTabsContext,
    setTabsNodeContext,
  } from "./context.svelte";

  const { config, children }: ComponentProps["layout"] = $props();

  const tabsCtx = getTabsContext();
  const node = createTabsNode(0);
  tabsCtx.set(config.id, node);
  setTabsContext(node.children);
  setTabsNodeContext(node);

  function getTabTitle(i: number): string {
    // TODO: handle `config.uiOptions`
    const { items } = config.schema;
    const fallback = `Tab ${i + 1}`;
    if (!Array.isArray(items)) {
      return fallback;
    }
    const item = items[i];
    if (isSchema(item)) {
      return item.title ?? fallback;
    }
    return fallback;
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
