<script>
  import { Draggable } from "@dnd-kit/dom";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import { getBuilderContext, getDndManager } from "./context.svelte.js";

  const ctx = getBuilderContext();
</script>

<div
  class="group flex items-center gap-2 p-2 rounded-md cursor-grab hover:bg-accent hover:text-accent-foreground"
  {@attach (element) => {
    const manager = getDndManager(ctx);
    const id = crypto.randomUUID();
    const draggable = new Draggable(
      {
        id,
        element,
        feedback: "clone",
      },
      manager
    );
    return () => {
      draggable.destroy()
    }
  }}
>
  <GripVertical class="size-4" />
  <span class="text-sm font-medium text-foreground"> Button </span>
</div>
