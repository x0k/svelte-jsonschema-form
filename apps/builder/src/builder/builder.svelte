<script>
  import { getBuilderContext } from "./context.svelte.js";
  import SingleDropZone from "./single-drop-zone.svelte";

  const ctx = getBuilderContext();
</script>

<SingleDropZone
  nodeId={ctx.rootNodeId}
  onDrop={(node) => {
    ctx.setRootNode(node);
  }}
  unmount={() => ctx.reset()}
/>
