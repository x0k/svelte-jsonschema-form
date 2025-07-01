<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";
  import NodeContainer from "../node-container.svelte";
  import NodeHeader from "../node-header.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.String> = $props();
</script>

<NodeContainer bind:node {draggable}>
  <NodeHeader {node} {unmount} {draggable} disablePadding />
</NodeContainer>
