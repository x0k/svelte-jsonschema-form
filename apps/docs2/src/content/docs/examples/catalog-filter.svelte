<script
  lang="ts"
  generics="
  TCategory extends string,
  TTag extends string,
  TItem extends { meta: { tags: readonly TTag[] } }
"
>
  import { SvelteSet } from "svelte/reactivity";
  import { filterByTags } from "meta";
  import type { Snippet } from "svelte";

  interface Props {
    tags: readonly TTag[];
    categories: Iterable<TCategory>;
    grouped: Partial<Record<TCategory, readonly TItem[]>>;
    label: string;
    children: Snippet<[{ category: TCategory; items: readonly TItem[] }]>;
  }

  let { tags, categories, grouped, label, children }: Props = $props();

  const selectedTags = new SvelteSet<TTag>();

  const categoriesWithItems = $derived.by(() => {
    const result: { category: TCategory; items: TItem[] }[] = [];
    for (const category of categories) {
      const all = grouped[category] ?? [];
      const filtered = filterByTags(
        all,
        selectedTags,
        (item) => item.meta.tags
      );
      if (filtered.length > 0) {
        result.push({ category, items: [...filtered] });
      }
    }
    return result;
  });

  const totalCount = $derived(
    categoriesWithItems.reduce((sum, { items }) => sum + items.length, 0)
  );

  const selectedArr = $derived(Array.from(selectedTags));

  const disabledTags = $derived.by(() => {
    const disabled = new Set<TTag>();
    if (selectedTags.size === 0) {
      return disabled;
    }
    for (const tag of tags) {
      if (selectedTags.has(tag)) {
        continue;
      }
      let hasMatch = false;
      for (const category of categories) {
        const all = grouped[category] ?? [];
        hasMatch = all.some((item) => {
          const itemTags = item.meta.tags;
          return (
            itemTags.includes(tag) &&
            selectedArr.every((selectedTag) => itemTags.includes(selectedTag))
          );
        });
        if (hasMatch) break;
      }
      if (!hasMatch) disabled.add(tag);
    }
    return disabled;
  });
</script>

<div class="tag-bar">
  {#each tags as tag (tag)}
    <button
      class="tag-chip"
      class:active={selectedTags.has(tag)}
      class:disabled={disabledTags.has(tag)}
      disabled={disabledTags.has(tag)}
      onclick={() => {
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
        } else {
          selectedTags.add(tag);
        }
      }}
    >
      {tag}
    </button>
  {/each}
</div>

<p class="count">
  Showing {totalCount}
  {totalCount === 1 ? label : `${label}s`}{#if selectedTags.size > 0}, <button
      class="clear-btn"
      onclick={() => selectedTags.clear()}>clear filter</button
    >{/if}
</p>

{#each categoriesWithItems as { category, items }}
  <details open>
    <summary>{category}</summary>
    {@render children({ category, items })}
  </details>
{/each}

<style>
  details {
    border: none;
    padding: 0;
  }

  summary {
    font-size: var(--sl-text-h3);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-headings);
    cursor: pointer;
    margin-top: 1.5rem;
  }

  .tag-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .tag-chip {
    padding: 0.25rem 0.75rem;
    margin: 0;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 999px;
    background: transparent;
    color: var(--sl-color-gray-3);
    cursor: pointer;
    font-size: var(--sl-text-sm);
    font-family: inherit;
    line-height: 1.4;
    outline: none;
  }

  .tag-chip:hover {
    border-color: var(--sl-color-gray-2);
    color: var(--sl-color-white);
  }

  .tag-chip.active {
    border: 1px solid var(--sl-color-gray-2);
    background: var(--sl-color-gray-5);
    color: var(--sl-color-white);
  }

  .tag-chip.disabled {
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
  }

  .clear-btn {
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    outline: none;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .clear-btn:hover {
    color: var(--sl-color-red);
  }

  .count {
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-sm);
    margin: 1rem 0;
  }
</style>
