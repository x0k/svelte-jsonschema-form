<script lang="ts" module>
  import type { SupportedLanguage } from "@/lib/shiki";

  export interface CodeFile {
    title: string;
    lang: SupportedLanguage;
    content: string;
  }
</script>

<script lang="ts">
  import Copy from "@lucide/svelte/icons/copy";
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
  const codeViewId = $props.id();

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

  function handleTabKeydown(event: KeyboardEvent, index: number) {
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % files.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + files.length) % files.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = files.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectedIndex = nextIndex;
    const tabs = (
      event.currentTarget as HTMLElement
    ).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[nextIndex]?.focus();
  }
</script>

<div class="code-view">
  {#if files.length > 1}
    <div class="code-tabs" role="tablist" aria-label="Code files">
      {#each files as file, i (file.title)}
        <button
          type="button"
          class="code-tab"
          class:active={selectedIndex === i}
          id={`${codeViewId}-tab-${i}`}
          role="tab"
          aria-controls={`${codeViewId}-panel`}
          aria-selected={selectedIndex === i}
          tabindex={selectedIndex === i ? 0 : -1}
          onclick={() => {
            selectedIndex = i;
          }}
          onkeydown={(event) => handleTabKeydown(event, i)}
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
      <Button
        variant="outlined"
        size="lg"
        onclick={handleCopy}
        aria-label={copyStatus === "copied"
          ? "Copied to clipboard"
          : "Copy code to clipboard"}
        title="Copy to clipboard"
      >
        {#if copyStatus === "copied"}
          <Check size={16} />
        {:else}
          <Copy size={16} />
        {/if}
      </Button>
      {#if showButton}
        <Button
          variant="outlined"
          size="lg"
          onclick={() => (expanded = !expanded)}
          aria-controls={`${codeViewId}-panel`}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse code" : "Expand code"}
          title={expanded ? "Collapse" : "Expand"}
        >
          {#if expanded}
            <ChevronUp size={16} />
          {:else}
            <ChevronDown size={16} />
          {/if}
        </Button>
      {/if}
    </div>
    <div
      id={`${codeViewId}-panel`}
      class="code-scroll"
      role={files.length > 1 ? "tabpanel" : undefined}
      aria-label={files.length === 1
        ? `${files[selectedIndex].title} code`
        : undefined}
      aria-labelledby={files.length > 1
        ? `${codeViewId}-tab-${selectedIndex}`
        : undefined}
      tabindex="0"
      style:max-height={showButton && !expanded
        ? `${COLLAPSED_MAX_HEIGHT}px`
        : `${contentHeight}px`}
    >
      {@html selected}
    </div>
    <span class="sr-only" aria-live="polite">
      {copyStatus === "copied" ? "Copied to clipboard" : ""}
    </span>
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
  .code-tab:focus-visible {
    outline: 2px solid var(--sl-color-text-accent);
    outline-offset: 2px;
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
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
