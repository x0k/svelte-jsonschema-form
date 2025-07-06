<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import NodeContainer from "../node-container.svelte";
  import NodeHeader from "../node-header.svelte";
  import SingleDropZone from "../single-dropzone.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired
  }: NodeProps<NodeType.Array> = $props();
</script>

<NodeContainer bind:node {draggable} {showRequired}>
  <NodeHeader {node} {draggable} {unmount} {showRequired} />
  <SingleDropZone bind:node={node.item} showRequired={false} />
</NodeContainer>
