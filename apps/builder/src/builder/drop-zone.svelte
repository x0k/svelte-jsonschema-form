<script lang="ts">
  import type { Snippet } from "svelte";

  import type { BuilderDroppable } from "./context.svelte.js";

  interface Props {
    droppable: BuilderDroppable;
    placeholder: Snippet;
  }

  const { droppable, placeholder }: Props = $props();
</script>

<div
  class={[
    "flex h-full w-full items-center justify-center rounded-md border-2 border-dashed p-6",
    droppable.isOver && "border-chart-2 bg-chart-2/5"
  ]}
  {@attach droppable.attach}
>
  <div
    class={[
      "text-center text-lg font-medium",
      droppable.isReady ? "text-foreground" : "text-muted-foreground"
    ]}
  >
    {@render placeholder()}
  </div>
</div>
