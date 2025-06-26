<script>
  import { getBuilderContext, setNodeContext } from "./context.svelte.js";
  import SingleDropZone from "./single-drop-zone.svelte";

  const ctx = getBuilderContext();
  setNodeContext({
    isDragged: false,
  });
</script>

<SingleDropZone bind:node={ctx.rootNode} />
