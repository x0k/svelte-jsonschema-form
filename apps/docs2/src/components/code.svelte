<script lang="ts" module>
  import type { SupportedLanguage } from "@/lib/shiki";

  export interface CodeFile {
    title: string;
    lang: SupportedLanguage;
    content: string;
  }
</script>

<script lang="ts">
  import Clipboard from "@lucide/svelte/icons/clipboard";
  import Check from "@lucide/svelte/icons/check";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";

  import { highlight, highlighterPromise } from "@/lib/shiki";
  import { copyTextToClipboard } from "@/lib/copy-to-clipboard";

  import Button from "./button.svelte";

  const COLLAPSED_MAX_HEIGHT = 500;

  interface Props {
    files: CodeFile[];
  }

  const { files }: Props = $props();

  const highlightFiles = async () => {
    const entries = Object.entries(files);
    const highlighter = await highlighterPromise;
    const result: Record<string, string> = {};
    for (const [name, { content, lang }] of entries) {
      result[name] = highlight(highlighter, lang, content);
    }
    return result;
  };

  const highlightedFiles = $derived(await highlightFiles());

  let selectedIndex = $state(0);

  let selected = $derived(highlightedFiles[selectedIndex]);

  let copyStatus = $state<"idle" | "copied">("idle");
  let copyTimeout: ReturnType<typeof setTimeout>;

  let expanded = $state(false);
  let showButton = $state(false);
  let contentHeight = $state(COLLAPSED_MAX_HEIGHT);
  let codeContentEl = $state<HTMLElement>();

  $effect(() => {
    void selected;
    const pre = codeContentEl?.querySelector("pre.shiki");
    if (!pre) {
      return;
    }
    const height = pre.scrollHeight;
    showButton = height > COLLAPSED_MAX_HEIGHT;
    contentHeight = height;
  });

  function handleCopy() {
    copyTextToClipboard(files[selectedIndex].content).then(() => {
      copyStatus = "copied";
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        copyStatus = "idle";
      }, 1500);
    });
  }
</script>

<div class="code-view">
  {#if files.length > 1}
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
  {/if}
  <div
    class="code-content"
    class:collapsed={showButton && !expanded}
    bind:this={codeContentEl}
  >
    <div class="buttons">
      <Button variant="icon" onclick={handleCopy} title="Copy to clipboard">
        {#if copyStatus === "copied"}
          <Check size={14} />
        {:else}
          <Clipboard size={14} />
        {/if}
      </Button>
      {#if showButton}
        <Button
          variant="icon"
          onclick={() => (expanded = !expanded)}
          title={expanded ? "Collapse" : "Expand"}
        >
          {#if expanded}
            <ChevronUp size={14} />
          {:else}
            <ChevronDown size={14} />
          {/if}
        </Button>
      {/if}
    </div>
    <div
      class="code-scroll"
      style:max-height={showButton && !expanded
        ? `${COLLAPSED_MAX_HEIGHT}px`
        : `${contentHeight}px`}
    >
      {@html selected}
    </div>
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
    position: relative;
    margin: 0;
    border: 0;
    background: var(--sl-color-gray-6);
    font-size: var(--sl-text-sm);
  }
  .code-scroll {
    margin: 0;
    padding: 0;
    overflow-y: auto;
    overflow-x: auto;
    transition: max-height 0.3s ease;
    scrollbar-width: none;
  }
  .code-scroll::-webkit-scrollbar {
    display: none;
  }
  .buttons {
    position: absolute;
    top: 0.375rem;
    right: 0.375rem;
    z-index: 1;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .code-content:hover .buttons,
  .code-content:focus-within .buttons {
    opacity: 1;
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
