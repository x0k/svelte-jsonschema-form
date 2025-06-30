<script lang="ts" generics="T extends NodeType">
  import { NodeType } from "$lib/builder/builder.js";

  import {
    getBuilderContext,
    getNodeContext,
    type DroppableOptions,
  } from "./context.svelte.js";

  const options: DroppableOptions<T> = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();

  const droppable = ctx.createDroppable(nodeCtx, options);
</script>

<div class="h-2 flex items-center" {@attach droppable.attach}>
  <div class={["w-full h-0.5 bg-chart-2", !droppable.isOver && "hidden"]}></div>
</div>
