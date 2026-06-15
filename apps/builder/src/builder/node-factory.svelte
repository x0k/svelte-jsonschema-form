<script lang="ts">
  import { noop } from "@sjsf/form/lib/function";
  import type { Snippet } from "svelte";

  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext } from "./context.svelte.js";

  interface Props {
    createNode: () => Node;
    title: string;
    icon: Snippet;
  }

  const { createNode, title, icon }: Props = $props();

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
    "bg-background hover:bg-accent flex cursor-grab items-center gap-2 rounded-md border p-2 select-none",
    draggable.isDragged && "bg-accent",
  ]}
  {@attach draggable.attach}
>
  {@render icon()}
  <span class="text-foreground text-sm font-medium">{title}</span>
</div>
