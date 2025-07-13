<script lang="ts" module>
  import type { SupportedLanguage } from "$lib/shiki.js";

  export interface CodeFile {
    title: string;
    content: string;
    lang: SupportedLanguage;
  }
</script>

<script lang="ts">
  import { highlight } from "$lib/shiki.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CopyButton } from "$lib/components/copy-button/index.js";

  interface Props {
    files: CodeFile[];
  }

  const { files }: Props = $props();

  let selected = $derived(files[0]);
</script>

<div class="rounded-md border">
  {#if selected}
    <div class="flex gap-2 p-2 border-b">
      {#each files as file (file.title)}
        <Button
          size="sm"
          variant="ghost"
          class={[
            selected.title === file.title &&
              "bg-accent text-accent-foreground dark:bg-accent/50",
          ]}
          onclick={() => {
            selected = file;
          }}>{file.title}</Button
        >
      {/each}
      <CopyButton
        class="ml-auto"
        size="sm"
        variant="ghost"
        text={selected.content}
      />
    </div>
    <div>
      {@html highlight(selected.lang, selected.content)}
    </div>
  {:else}
    <p class="p-4 text-center text-muted-foreground">No files</p>
  {/if}
</div>

<style>
  @reference '../../app.css';

  /* :global(.dark) {
    :global(.shiki, .shiki span) {
      color: var(--shiki-dark) !important;
      font-style: var(--shiki-dark-font-style) !important;
      font-weight: var(--shiki-dark-font-weight) !important;
      text-decoration: var(--shiki-dark-text-decoration) !important;
    }
  } */

  /* Shiki see: https://shiki.matsu.io/guide/dual-themes#class-based-dark-mode */
  :global(html.dark .shiki, html.dark .shiki span) {
    color: var(--shiki-dark) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }

  :global(pre.shiki) {
    @apply overflow-x-auto rounded-lg bg-inherit py-4 text-sm;
  }

  :global(pre.shiki:not([data-code-overflow] *):not([data-code-overflow])) {
    @apply overflow-y-auto;
    max-height: min(100%, 650px);
  }

  :global(pre.shiki code) {
    @apply grid min-w-full rounded-none border-0 bg-transparent p-0 break-words;
    counter-reset: line;
    box-decoration-break: clone;
  }

  :global(pre.line-numbers) {
    counter-reset: step;
    counter-increment: step 0;
  }

  :global(pre.line-numbers .line::before) {
    content: counter(step);
    counter-increment: step;
    display: inline-block;
    width: 1.8rem;
    margin-right: 1.4rem;
    text-align: right;
  }

  :global(pre.line-numbers .line::before) {
    @apply text-muted-foreground;
  }

  :global(pre .line.line--highlighted) {
    @apply bg-secondary;
  }

  :global(pre .line.line--highlighted span) {
    @apply relative;
  }

  :global(pre .line) {
    @apply inline-block min-h-4 w-full px-4 py-0.5;
  }

  :global(pre.line-numbers .line) {
    @apply px-2;
  }
</style>
