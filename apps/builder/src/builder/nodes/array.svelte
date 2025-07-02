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
  }: NodeProps<NodeType.Array> = $props();
</script>

<NodeContainer bind:node {draggable}>
  <NodeHeader {node} {draggable} {unmount} />
  <SingleDropZone bind:node={node.item} />
</NodeContainer>
