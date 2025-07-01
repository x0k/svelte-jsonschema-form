<script lang="ts">
  import type { BuilderDroppable } from './context.svelte.js';

  interface Props {
    droppable: BuilderDroppable
    placeholder: string
  }

  const { droppable, placeholder }: Props = $props()
</script>
<div
  class={[
    "border-2 border-dashed rounded-md p-6 w-full h-full flex items-center justify-center",
    droppable.isOver && "border-chart-2 bg-chart-2/5",
  ]}
  {@attach droppable.attach}
>
  <p class="text-lg text-center font-medium text-foreground">
    {placeholder}
  </p>
</div>
