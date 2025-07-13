<script>
  import { getBuilderContext } from "../context.svelte.js";
  import { setNodeContext } from '../node-context.js';
  import SingleDropZone from "../single-dropzone.svelte";

  const ctx = getBuilderContext();
  setNodeContext({
    isDragged: false,
  });
</script>

<SingleDropZone bind:node={ctx.rootNode} showRequired={false} />
