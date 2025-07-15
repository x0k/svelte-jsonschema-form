<script lang="ts">
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import { noop } from '@sjsf/form/lib/function';

  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext } from "./context.svelte.js";

  interface Props {
    createNode: () => Node;
    title: string;
  }

  const { createNode, title }: Props = $props();

  const ctx = getBuilderContext();
  const draggable = ctx.createDraggable({
    unmount: noop,
    get node() {
      return createNode();
    },
  });
</script>

<div
  class={[
    "flex items-center gap-2 p-2 rounded-md cursor-grab border hover:bg-accent",
    draggable.isDragged && "bg-accent",
  ]}
  {@attach draggable.attach}
>
  <GripVertical class="size-4" />
  <span class="text-sm font-medium text-foreground">{title}</span>
</div>
