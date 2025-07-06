<script lang="ts">
  import { on } from "svelte/events";

  import { TooltipProvider } from "$lib/components/ui/tooltip/index.js";

  import {
    Controls,
    Builder,
    BuilderContext,
    setBuilderContext,
    Settings,
  } from "./builder/index.js";
  import { setShadcnContext } from "./shadcn-context.js";

  setShadcnContext();
  const ctx = new BuilderContext();
  setBuilderContext(ctx);

  let rootElements = new Array<HTMLDivElement>(3);
  $effect(() =>
    on(document, "mousedown", ({ target }) => {
      if (
        target instanceof Node &&
        rootElements.every((el) => el !== target) &&
        rootElements.some((el) => el.contains(target))
      ) {
        return;
      }
      ctx.clearSelection();
    })
  );
</script>

<TooltipProvider delayDuration={0}>
  <div class="min-h-screen bg-background" style="--header-height: 60px;">
    <div class="sticky top-0 z-50 bg-background">
      <div class="mx-auto px-8 py-4">
        <h1 class="text-xl font-bold">Form Builder</h1>
      </div>
    </div>

    <div class="grid grid-cols-[1fr_6fr_2fr] gap-4 mx-auto">
      <div
        bind:this={rootElements[0]}
        class="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] pb-4 overflow-y-auto pl-8 min-w-[120px]"
      >
        <Controls />
      </div>

      <div bind:this={rootElements[1]} class="p-4 pt-0">
        <Builder />
      </div>

      <div
        bind:this={rootElements[2]}
        class="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] pb-4 overflow-y-auto pr-8 min-w-[200px]"
      >
        <Settings />
      </div>
    </div>
  </div>
</TooltipProvider>
