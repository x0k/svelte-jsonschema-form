<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

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
    node: Node;
    unmount: () => void;
  }

  let { node = $bindable(), unmount }: Props = $props();

  const ctx = getBuilderContext();
  let nodeSnapshot: Node;
  const draggable = ctx.createDraggableNode({
    beforeDrop() {
      nodeSnapshot = $state.snapshot(node);
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

<NodeContainer bind:node {draggable}>
  {#if NodeComponent}
    <NodeComponent bind:node={node as never} {unmount} {draggable} />
  {:else}
    <NodeHeader {node} {unmount} {draggable} />
  {/if}
</NodeContainer>
