<script lang="ts">
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import { createNode, type SelectableNodeType } from "$lib/builder/index.js";

  import { getBuilderContext } from "./context.svelte.js";

  interface Props {
    nodeType: SelectableNodeType;
    title: string;
  }

  const { nodeType, title }: Props = $props();

  const ctx = getBuilderContext();
  const draggable = ctx.createDraggable({
    unmount() {},
    get node() {
      return createNode(nodeType);
    },
  });
</script>

<div
  class={[
    "group flex items-center gap-2 p-2 rounded-md cursor-grab border hover:bg-accent",
    draggable.isDragged && "bg-accent",
  ]}
  {@attach draggable.attach}
>
  <GripVertical class="size-4" />
  <span class="text-sm font-medium text-foreground">{title}</span>
</div>
