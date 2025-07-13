<script lang="ts">
  import { on } from "svelte/events";

  import { getBuilderContext } from "../context.svelte.js";

  import Content from './content.svelte';
  import Settings from './settings.svelte';
  import Controls from './controls.svelte';

  const ctx = getBuilderContext();

  let rootElements = $state(new Array<HTMLDivElement | null>(3));
  $effect(() =>
    on(document, "mousedown", ({ target }) => {
      if (
        target instanceof Node &&
        rootElements.every((el) => el !== target) &&
        rootElements.some((el) => el?.contains(target))
      ) {
        return;
      }
      ctx.clearSelection();
    })
  );
</script>

<div class="grid grid-cols-[1fr_6fr_2fr] gap-4 mx-auto">
  <div
    bind:this={rootElements[0]}
    class="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] pb-4 overflow-y-auto pl-8 min-w-[120px]"
  >
    <Controls />
  </div>

  <div bind:this={rootElements[1]} class="p-4 pt-0">
    <Content />
  </div>
  <div
    bind:this={rootElements[2]}
    class="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] pb-4 overflow-y-auto pr-8 min-w-[200px]"
  >
    <Settings />
  </div>
</div>
