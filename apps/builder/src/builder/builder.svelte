<script>
  import { getBuilderContext } from "./context.svelte.js";
  import SingleDropZone from "./single-drop-zone.svelte";

  const ctx = getBuilderContext();
</script>

<SingleDropZone bind:node={ctx.rootNode} />
