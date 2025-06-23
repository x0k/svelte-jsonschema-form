<script lang="ts">
  import { createDroppable, getBuilderContext } from "./context.svelte.js";

  interface Props {
    items: []
  }

  const ctx = getBuilderContext();
  const droppable = createDroppable(ctx);
</script>

<div class="border-2 border-dashed rounded-lg">
  <div
    class="flex flex-col items-center justify-center h-64 text-muted-foreground"
    {@attach droppable.attach}
  >
    <p class="text-lg font-medium text-foreground">Drop form elements here</p>
    <p class="text-sm text-muted-foreground">
      Drag elements from the sidebar to start building your form
    </p>
  </div>
</div>
