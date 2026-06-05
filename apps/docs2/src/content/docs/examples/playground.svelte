<script lang="ts">
  import lz from "lz-string";
  import {
    formPresetCategories,
    GROUPED_FORM_PRESETS,
    PresetTag,
    type PresetEntry,
  } from "meta/playground";

  import ExampleCards from "./example-cards.svelte";
  import CatalogFilter from "./catalog-filter.svelte";

  const { playgroundLink }: { playgroundLink: string } = $props();
</script>

<CatalogFilter
  tags={Object.values(PresetTag)}
  categories={formPresetCategories()}
  grouped={GROUPED_FORM_PRESETS}
  label="preset"
>
  {#snippet children({ category, items })}
    <ExampleCards
      {items}
      onclick={async (preset: PresetEntry) => {
        const data = await preset.load();
        window.open(
          `${playgroundLink}#${lz.compressToEncodedURIComponent(JSON.stringify(data))}`
        );
      }}
      title={(preset) => preset.meta.title}
      description={(preset) => preset.meta.description}
    >
      {#snippet children(preset)}
        <span class="tag-pills">
          {#each preset.meta.tags as tag (tag)}
            <span class="tag-pill">{tag}</span>
          {/each}
        </span>
      {/snippet}
    </ExampleCards>
  {/snippet}
</CatalogFilter>

<style>
  :global(html) {
    overflow-y: scroll;
  }
  .tag-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tag-pill {
    padding: 0.125rem 0.5rem;
    border: 1px solid var(--sl-color-gray-6);
    border-radius: 999px;
    font-size: var(--sl-text-xs);
    color: var(--sl-color-gray-3);
  }
</style>
