<script lang="ts" generics="N extends Node">
  import type { Node } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    type DroppableOptions,
  } from "./context.svelte.js";
  import { getNodeContext } from "./node-context.js";

  const options: DroppableOptions<N> = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();

  const droppable = ctx.createDroppable(nodeCtx, options);
</script>

<div class="h-2 w-full flex flex-col justify-center" {@attach droppable.attach}>
  <div class={["w-full h-0.5 bg-chart-2", !droppable.isOver && "hidden"]}></div>
</div>
