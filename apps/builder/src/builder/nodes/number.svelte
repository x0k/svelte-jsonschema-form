<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import NodeContainer from "../node-container.svelte";
  import NodeHeader from "../customizable-node-header.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
  }: NodeProps<NodeType.Number> = $props();
</script>

<NodeContainer bind:node {draggable} {showRequired}>
  <NodeHeader {node} {unmount} {draggable} {showRequired} disablePadding />
</NodeContainer>
