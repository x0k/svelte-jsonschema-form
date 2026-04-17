<script lang="ts">
  import type { Component } from "svelte";

  import { router, type Page } from "./router.js";
  import Form from "./form/form.svelte";
  import Validator from "./validator.svelte";
  import Merger from "./merger.svelte";

  const PAGES: Record<Page, Component<{}, {}, any>> = {
    "": Form,
    v: Validator,
    m: Merger,
  };

  const PageComponent = $derived(PAGES[router.page]);
</script>

<div
  class="p-4 gap-4 h-screen grid grid-rows-[auto_1fr] grid-cols-1 dark:scheme-dark"
>
  <PageComponent />
</div>

<style>
  @reference './app.css';
  :global {
    [data-split] {
      --resizer-len: var(--gap);
      --resizer-offset: calc(-50% - var(--gap) / 2);

      width: 100%;
      height: 100%;
    }
    [data-split-item] {
      position: relative;
    }
    [data-split-resizer] {
      position: absolute;
      inset: 0;
    }
    [data-dir="row"] > [data-split-item] > [data-split-resizer] {
      cursor: col-resize;
      width: var(--resizer-len);
      transform: translateX(var(--resizer-offset));
    }
    [data-dir="column"] > [data-split-item] > [data-split-resizer] {
      cursor: row-resize;
      height: var(--resizer-len);
      transform: translateY(var(--resizer-offset));
    }
    [data-tabs] {
      @apply flex flex-col rounded-md border h-full bg-background;
      &:has([data-error="true"]) {
        @apply border-destructive;
      }
    }
    [data-tabs-bar] {
      @apply flex border-b p-2 gap-1;
    }
    [data-tabs-list] {
      @apply flex gap-1 overflow-x-auto;
      scrollbar-width: thin;
    }
    [data-tabs-header] {
      @apply flex gap-1 items-center py-1 pl-2 pr-3 rounded-sm;
      > svg {
        @apply size-5;
      }
      &[aria-selected="true"] {
        @apply bg-muted-foreground/20 text-accent-foreground;
      }
      &:hover {
        @apply bg-muted-foreground/30;
      }
      &[data-over="true"] {
        @apply bg-chart-2/70;
      }
    }
    [data-tabs-spacer] {
      @apply grow h-full rounded-sm;
      &[data-over="true"] {
        @apply bg-chart-2/70;
      }
    }
    [data-tabs-actions] {
      @apply flex;
    }
    [data-tabs-content] {
      @apply grow overflow-auto relative;
      &::after {
        @apply bg-chart-2/70 rounded-md;
        content: "";
        position: absolute;
        pointer-events: none;
        transition: inset 160ms ease;
      }
      &[data-over="true"] {
        &::after {
          opacity: 0.4;
        }
        &[data-hpart="center"][data-vpart="center"]::after {
          inset: 0;
        }

        &[data-hpart="start"]::after {
          inset: 0 50% 0 0;
        }

        &[data-hpart="end"]::after {
          inset: 0 0 0 50%;
        }

        &[data-hpart="center"][data-vpart="start"]::after {
          inset: 0 0 50% 0;
        }

        &[data-hpart="center"][data-vpart="end"]::after {
          inset: 50% 0 0 0;
        }
      }
    }
  }
</style>
