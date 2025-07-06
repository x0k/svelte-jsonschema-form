<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import NodeHeader from "../customizable-node-header.svelte";
  import NodeContainer from "../node-container.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
  }: NodeProps<NodeType.Boolean> = $props();
</script>

<NodeContainer bind:node {draggable} {showRequired}>
  <NodeHeader {node} {unmount} {draggable} {showRequired} disablePadding />
</NodeContainer>
