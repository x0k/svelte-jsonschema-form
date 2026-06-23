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

  // svelte-ignore state_referenced_locally
  const droppable = ctx.createDroppable(nodeCtx, options);
</script>

<div class="flex h-2 w-full flex-col justify-center" {@attach droppable.attach}>
  <div class={["bg-chart-2 h-0.5 w-full", !droppable.isOver && "hidden"]}></div>
</div>
