<script lang="ts">
  import type { Component } from "svelte";

  import { Toaster } from "$lib/components/ui/sonner/index.js";

  import Form from "./form/form.svelte";
  import Merger from "./merger.svelte";
  import { router, type Page } from "./router.js";
  import { themeManager } from "./theme.svelte";
  import Validator from "./validator.svelte";

  const PAGES: Record<Page, Component<{}, {}, any>> = {
    "": Form,
    v: Validator,
    m: Merger,
  };

  const PageComponent = $derived(PAGES[router.page]);
</script>

<Toaster richColors theme={themeManager.theme} />
<div
  class="grid h-screen grid-cols-1 grid-rows-[auto_1fr] gap-4 p-4 dark:scheme-dark"
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
      @apply bg-background flex h-full flex-col rounded-md border;
      &:has([data-error="true"]) {
        @apply border-destructive;
      }
    }
    [data-tabs-bar] {
      @apply flex gap-1 border-b p-2;
    }
    [data-tabs-list] {
      @apply flex gap-1 overflow-x-auto;
      scrollbar-width: thin;
    }
    [data-tabs-header] {
      @apply flex items-center gap-1 rounded-sm py-1 pr-3 pl-2;
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
      @apply h-full grow rounded-sm;
      &[data-over="true"] {
        @apply bg-chart-2/70;
      }
    }
    [data-tabs-actions] {
      @apply flex;
    }
    [data-tabs-content] {
      @apply relative grow overflow-auto;
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
