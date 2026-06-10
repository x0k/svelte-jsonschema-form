<script lang="ts" module>
  export interface CodeFile {
    title: string;
    lang: string;
    content: string;
  }
</script>

<script lang="ts">
  import type { HighlighterCore } from "shiki/core";
  import { highlight, type SupportedLanguage } from "@/lib/shiki";

  interface Props {
    highlighter: HighlighterCore;
    files: CodeFile[];
  }

  const { highlighter, files }: Props = $props();

  let selectedIndex = $state(0);

  let selected = $derived(files[selectedIndex]);

  let highlighted = $derived(
    selected
      ? highlight(
          highlighter,
          selected.lang as SupportedLanguage,
          selected.content
        )
      : ""
  );
</script>

<div class="code-view">
  <div class="code-tabs">
    {#each files as file, i (file.title)}
      <button
        class="code-tab"
        class:active={selectedIndex === i}
        onclick={() => {
          selectedIndex = i;
        }}
      >
        {file.title}
      </button>
    {/each}
  </div>
  <div class="code-content">
    {#if highlighted}
      {@html highlighted}
    {/if}
  </div>
</div>

<style>
  .code-view {
    min-height: 0;
  }
  .code-tabs {
    display: flex;
    gap: 0;
    /* background: var(--sl-color-bg-nav); */
  }
  .code-tab {
    all: unset;
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    color: var(--sl-color-gray-3);
    cursor: pointer;
    font-size: var(--sl-text-xs);
    font-family: var(--sl-font);
    border-bottom: 2px solid transparent;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .code-tab:hover {
    color: var(--sl-color-white);
  }
  .code-tab.active {
    color: var(--sl-color-white);
    border-bottom-color: var(--sl-color-text-accent);
  }
  .code-content {
    margin: 0;
    border: 0;
    background: var(--sl-color-gray-6);
    overflow-x: auto;
    font-size: var(--sl-text-sm);
  }
  .code-content :global(pre.shiki) {
    margin: 0;
    border: 0;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    /* background: var(--sl-color-bg) !important; */
  }
  .code-content :global(pre.shiki code) {
    background: transparent;
    font-family: var(--sl-font-mono);
  }
</style>
