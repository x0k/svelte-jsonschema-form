<script>
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import { createNode, NodeType } from "$lib/builder/builder.js";

  import { createDraggable, getBuilderContext } from "./context.svelte.js";

  const ctx = getBuilderContext();
  const draggable = createDraggable(ctx, {
    get node() {
      return createNode(NodeType.Object);
    },
  });
</script>

<div
  class={[
    "group flex items-center gap-2 p-2 rounded-md cursor-grab hover:bg-accent",
    draggable.isDragged && "bg-accent",
  ]}
  {@attach draggable.attach}
>
  <GripVertical class="size-4" />
  <span class="text-sm font-medium text-foreground"> Button </span>
</div>
