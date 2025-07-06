<script>
  import { getBuilderContext, setNodeContext } from "./context.svelte.js";
  import SingleDropZone from "./single-dropzone.svelte";

  const ctx = getBuilderContext();
  setNodeContext({
    isDragged: false,
  });
</script>

<SingleDropZone bind:node={ctx.rootNode} showRequired={false} />
