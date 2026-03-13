<script lang="ts">
  import type { Snippet } from "svelte";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import RemoveButton from "./remove-button.svelte";
  import type { BuilderDraggable } from "./context.svelte.js";

  const {
    draggable,
    children,
    unmount,
    append,
    disablePadding
  }: {
    unmount: () => void;
    draggable: BuilderDraggable;
    children: Snippet;
    disablePadding?: boolean;
    append?: Snippet;
  } = $props();
</script>

<div class={["flex items-center gap-2 pt-2", disablePadding ? "pb-2" : "pb-4"]}>
  <div class="cursor-grab" {@attach draggable.attachHandle}>
    <GripVertical class="size-5" />
  </div>
  <div class="text-md flex-1 truncate">
    {@render children()}
  </div>
  {@render append?.()}
  <RemoveButton
    onClick={(e) => {
      e.stopPropagation();
      unmount();
    }}
  />
</div>
