<script lang="ts">
  import type { Snippet } from "svelte";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import Trash from "@lucide/svelte/icons/trash-2";

  import { Button } from "$lib/components/ui/button/index.js";
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "./model.js";

  const {
    node,
    handle,
    unmount,
    append,
  }: NodeProps<NodeType> & {
    append?: Snippet;
  } = $props();
</script>

<div class="flex gap-2 items-center p-2">
  <div class="cursor-grab" {@attach handle}>
    <GripVertical class="size-5" />
  </div>
  <div class="text-md truncate flex-1">
    {node.options.title}
    {#if node.options.required}
      <span>*</span>
    {/if}
  </div>
  {@render append?.()}
  <Button
    variant="outline"
    size="icon"
    class="size-8"
    onclick={(e) => {
      e.stopPropagation();
      unmount();
    }}
  >
    <Trash />
  </Button>
</div>
