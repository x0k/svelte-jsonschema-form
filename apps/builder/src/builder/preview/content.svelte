<script lang="ts">
  import Code, { type CodeFile } from "$lib/components/code.svelte";

  import { getBuilderContext } from "../context.svelte.js";
  import { PreviewSubRouteName, type PreviewRoute } from "../model.js";
  import Form from "./form.svelte";

  const { route }: { route: PreviewRoute } = $props();

  const ctx = getBuilderContext();

  const ROUTE_FILES: Record<PreviewSubRouteName, CodeFile[]> = {
    [PreviewSubRouteName.Code]: [],
    [PreviewSubRouteName.Schema]: [
      {
        title: "schema.json",
        lang: "json",
        content: JSON.stringify(ctx.schema, null, 2),
      },
      {
        title: "ui-schema.json",
        lang: "json",
        content: JSON.stringify(ctx.uiSchema, null, 2),
      },
    ],
  };
</script>

{#if route.subRoute === undefined}
  <Form />
{:else}
  <Code files={ROUTE_FILES[route.subRoute]} />
{/if}

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
