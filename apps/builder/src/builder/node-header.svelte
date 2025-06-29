<script lang="ts">
  import type { Snippet } from "svelte";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "./model.js";
  import RemoveButton from "./remove-button.svelte";

  const {
    node,
    draggable,
    unmount,
    append,
  }: NodeProps<NodeType> & {
    append?: Snippet;
  } = $props();
</script>

<div class="flex gap-2 items-center p-1">
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
  <RemoveButton onClick={unmount} />
</div>
