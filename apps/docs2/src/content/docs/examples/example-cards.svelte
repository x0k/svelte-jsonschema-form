<script lang="ts" generics="T">
  import type { Snippet } from "svelte";

  interface Props {
    items: readonly T[];
    onclick: (item: T) => void;
    title: (item: T) => string;
    description: (item: T) => string;
    children?: Snippet<[item: T]>;
  }

  const { items, onclick, title, description, children }: Props = $props();
</script>

<div class="cards">
  <button style="display: none;">Avoid starlight styles pollution</button>
  {#each items as item (title(item))}
    <div
      class="card not-content"
      role="button"
      tabindex="0"
      onclick={() => onclick(item)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onclick(item);
        }
      }}
    >
      <span class="stack">
        <span class="title">{title(item)}</span>
        <span class="description">{description(item)}</span>
        {#if children}
          <span class="extras">{@render children(item)}</span>
        {/if}
      </span>
    </div>
  {/each}
</div>

<style>
  .cards {
    display: grid;
    grid-template-columns: 100%;
    gap: 1rem;
  }

  @media (min-width: 50rem) {
    .cards {
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
  }

  .card {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    box-shadow: var(--sl-shadow-sm);
    background: transparent;
    cursor: pointer;
    text-align: start;
    color: inherit;
  }

  .card:hover {
    background: var(--sl-color-gray-7, var(--sl-color-gray-6));
    border-color: var(--sl-color-gray-2);
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 100%;
  }

  .title {
    color: var(--sl-color-white);
    font-weight: 600;
    font-size: var(--sl-text-lg);
    line-height: var(--sl-line-height-headings);
  }

  .description {
    color: var(--sl-color-gray-3);
    line-height: 1.5;
  }

  .extras {
    margin-top: auto;
  }
</style>
