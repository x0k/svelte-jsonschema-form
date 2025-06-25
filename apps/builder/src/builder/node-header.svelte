<script lang="ts">
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import Trash from "@lucide/svelte/icons/trash-2";

  import { Button } from "$lib/components/ui/button/index.js";
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "./model.js";

  const {
    node,
    unmount,
  }: NodeProps<NodeType> & {
    unmount: () => void;
  } = $props();
</script>

<div class="flex gap-2 items-center p-1">
  <GripVertical class="size-6" />
  <span class="text-lg truncate flex-1">{node.title}</span>
  <Button
    variant="ghost"
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
