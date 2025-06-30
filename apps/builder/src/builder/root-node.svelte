<script lang="ts">
  import type { SelectableNode } from "$lib/builder/index.js";

  import { NODES } from "./nodes/index.js";
  import NodeContainer from "./node-container.svelte";
  import {
    getBuilderContext,
    getNodeContext,
    setNodeContext,
    type NodeContext,
  } from "./context.svelte.js";
  import NodeHeader from "./node-header.svelte";

  interface Props {
    node: SelectableNode;
    unmount: () => void;
  }

  let { node = $bindable(), unmount }: Props = $props();

  const ctx = getBuilderContext();
  let nodeSnapshot: SelectableNode;
  const draggable = ctx.createDraggable({
    onDragStart() {
      nodeSnapshot = $state.snapshot(node);
    },
    beforeDrop() {
      unmount();
    },
    get node() {
      return nodeSnapshot;
    },
  });

  const parentNodeCtx = getNodeContext();
  const nodeCtx: NodeContext = {
    get isDragged() {
      return parentNodeCtx.isDragged || draggable.isDragged;
    },
  };
  setNodeContext(nodeCtx);

  const NodeComponent = $derived(NODES[node.type]);
</script>

{#if NodeComponent}
  <NodeComponent bind:node={node as never} {unmount} {draggable} />
{:else}
  <NodeContainer bind:node {draggable}>
    <NodeHeader {node} {unmount} {draggable} />
  </NodeContainer>
{/if}
