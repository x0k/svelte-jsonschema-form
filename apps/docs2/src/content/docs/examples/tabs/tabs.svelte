<script lang="ts">
  import { isSchema } from "@sjsf/form/core";
  import type { ComponentProps } from "@sjsf/form";

  import { getTabsContext } from "./context.svelte";

  const { config, children }: ComponentProps["layout"] = $props();

  const tabsCtx = getTabsContext()

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

<div class="tabs">
  {#each tabsCtx.tabs as _, i}
    <button
      onclick={(e) => {
        e.preventDefault();
        tabsCtx.selectedTab = i
      }}
    >
      {getTabTitle(i)}
      {#if tabsCtx.selectedTab === i}
        (selected)
      {/if}
    </button>
  {/each}
</div>

{#each tabsCtx.tabs as tab, i}
  <div class={{ hidden: tabsCtx.selectedTab !== i }}>
    {@render tab()}
  </div>
{/each}

<!-- Or render only selected tab -->

<!-- {#if tabs.length > 0}
  {@render tabs[selectedTab]()}
{/if} -->

<style>
  .tabs {
    display: flex;
    gap: 1rem;
  }
  .tabs button {
    width: 100%;
  }
  .hidden {
    display: none;
  }
</style>
