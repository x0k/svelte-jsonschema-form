<script lang="ts">
  import type { BuilderDroppable } from "./context.svelte.js";

  interface Props {
    droppable: BuilderDroppable;
  }

  const { droppable }: Props = $props();
</script>

<div class="h-2 flex items-center" {@attach droppable.attach}>
  <div class={["w-full h-0.5 bg-chart-2", !droppable.isOver && "hidden"]}></div>
</div>
