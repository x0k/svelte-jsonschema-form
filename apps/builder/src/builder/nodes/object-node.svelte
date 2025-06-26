<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";
  import MultiDropZone from "../multi-drop-zone.svelte";

  const { node }: NodeProps<NodeType.Object> = $props();
</script>

<MultiDropZone nodeIds={node.children} onDrop={(node, index) => {
  
}} />
