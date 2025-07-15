<script lang="ts" generics="T extends CustomizableNodeType">
  import type { CustomizableNodeType } from "$lib/builder/node.js";

  import type { NodeProps } from "../model.js";
  import NodeContainer from "../node-container.svelte";
  import NodeHeader from "../customizable-node-header.svelte";
  import NodeIssues from '../node-issues.svelte';

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
  }: NodeProps<T> = $props();
</script>

<NodeContainer bind:node {draggable} {showRequired}>
  <NodeHeader {node} {unmount} {draggable} {showRequired} disablePadding />
  <NodeIssues {node} />
</NodeContainer>
