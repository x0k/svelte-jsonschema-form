<script lang="ts">
  import type { Snippet } from "svelte";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import type { SelectableNodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "./model.js";
  import RemoveButton from "./remove-button.svelte";
  import type { BuilderDraggable } from "./context.svelte.js";

  const {
    node,
    draggable,
    unmount,
    append,
    disablePadding,
  }: NodeProps<SelectableNodeType> & {
    draggable: BuilderDraggable;
    disablePadding?: boolean;
    append?: Snippet;
  } = $props();
</script>

<div class={["flex gap-2 items-center pt-2", disablePadding ? "pb-2" : "pb-4"]}>
  <div class="cursor-grab" {@attach draggable.attachHandle}>
    <GripVertical class="size-5" />
  </div>
  <div class="text-md truncate flex-1">
    {node.options.title}
    {#if node.options.required}
      <span>*</span>
    {/if}
  </div>
  {@render append?.()}
  <RemoveButton
    onClick={(e) => {
      e.stopPropagation();
      unmount();
    }}
  />
</div>
