<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext } from "./context.svelte.js";
  import { getNodeContext, setNodeContext } from "./node-context.js";
  import { NODES } from "./nodes/index.js";

  interface Props {
    node: Node;
    unmount: () => void;
    showRequired: boolean;
  }

  let { node = $bindable(), unmount, showRequired }: Props = $props();

  const ctx = getBuilderContext();

  const draggable = ctx.createDraggable({
    unmount,
    get node() {
      return node;
    },
  });

  const nodeCtx = getNodeContext();
  setNodeContext({
    get isDragged() {
      return nodeCtx.isDragged || draggable.isDragged;
    },
  });

  const NodeComponent = $derived(NODES[node.type]);
</script>

<NodeComponent bind:node={node as never} {draggable} {unmount} {showRequired} />
