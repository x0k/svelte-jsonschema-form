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
    // TODO: handle `config.uiSchema`
    const { items } = config.schema;
    if (Array.isArray(items)) {
      const item = items[i];
      if (isSchema(item) && item.title) {
        return item.title
      }
    }
    return `Tab ${i + 1}`;
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
