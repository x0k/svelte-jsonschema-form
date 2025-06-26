<script lang="ts">
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import Trash from "@lucide/svelte/icons/trash-2";

  import { Button } from "$lib/components/ui/button/index.js";
  import type { Node } from "$lib/builder/index.js";

  import { NODES } from "./nodes/index.js";
  import NodeContainer from "./node-container.svelte";
  import {
    getBuilderContext,
    getNodeContext,
    setNodeContext,
    type NodeContext,
  } from "./context.svelte.js";

  interface Props {
    node: Node;
    unmount: () => void;
  }

  let { node = $bindable(), unmount }: Props = $props();

  const ctx = getBuilderContext();
  let nodeSnapshot: Node;
  const draggable = ctx.createDraggable({
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

<NodeContainer {node} {@attach draggable.attach}>
  <div class="flex gap-2 items-center p-1">
    <div class="cursor-grab" {@attach draggable.attachHandle}>
      <GripVertical class="size-5" />
    </div>
    <span class="text-md truncate flex-1">{node.title}</span>
    <Button
      variant="ghost"
      size="icon"
      class="size-8"
      onclick={(e) => {
        e.stopPropagation();
        unmount();
      }}
    >
      <Trash />
    </Button>
  </div>
  <NodeComponent bind:node={node as never} />
</NodeContainer>
