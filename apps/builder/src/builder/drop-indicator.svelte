<script lang="ts" generics="N extends Node">
  import type { Node } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    getNodeContext,
    type DroppableOptions,
  } from "./context.svelte.js";

  const options: DroppableOptions<N> = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();

  const droppable = ctx.createDroppable(nodeCtx, options);
</script>

<div class="h-2 w-full" {@attach droppable.attach}>
  <div class={["w-full h-0.5 bg-chart-2", !droppable.isOver && "hidden"]}></div>
</div>
