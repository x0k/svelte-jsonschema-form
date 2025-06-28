<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext, getNodeContext } from "./context.svelte.js";

  interface Props {
    onDrop: (node: Node) => void;
  }

  const { onDrop }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext()

  const droppable = ctx.createDroppable(nodeCtx, {
    onDrop,
  });
</script>

<div class="h-2 flex items-center" {@attach droppable.attach}>
  <div
    class={[
      "w-full h-0.5 bg-primary rounded-full animate-pulse",
      !droppable.isOver && "hidden",
    ]}
  >
    <div class="h-full bg-primary rounded-full"></div>
  </div>
</div>
