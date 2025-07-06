<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import Container from "../container.svelte";
  import NodeHeader from "../node-header.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
  }: NodeProps<NodeType.String> = $props();
</script>

<Container bind:node {draggable} {showRequired}>
  <NodeHeader {node} {unmount} {draggable} {showRequired} disablePadding />
</Container>
