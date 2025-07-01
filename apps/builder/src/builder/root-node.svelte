<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    getNodeContext,
    setNodeContext,
    type NodeContext,
  } from "./context.svelte.js";
  import { NODES } from "./nodes/index.js";

  interface Props {
    node: Node;
    unmount: () => void;
  }

  let { node = $bindable(), unmount }: Props = $props();

  const ctx = getBuilderContext();

  const draggable = ctx.createDraggable({
    unmount,
    get node() {
      return node;
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

<NodeComponent bind:node={node as never} {draggable} {unmount} />
