<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";
  import MultiDropZone from "../multi-drop-zone.svelte";
  import NodeHeader from "../node-header.svelte";

  let { node = $bindable(), unmount }: NodeProps<NodeType.Object> = $props();
</script>

<div class="border rounded p-2 flex flex-col gap-1">
  <NodeHeader {node} {unmount} />
  <MultiDropZone bind:nodes={node.children} />
</div>
