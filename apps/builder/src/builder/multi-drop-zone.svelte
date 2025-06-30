<script lang="ts">
  import type { SelectableNode } from "$lib/builder/index.js";

  import { getBuilderContext, getNodeContext, selectableNode } from "./context.svelte.js";
  import DropZone from "./drop-zone.svelte";
  import DropIndicator from "./node-drop-indicator.svelte";
  import RootNode from "./root-node.svelte";

  interface Props {
    nodes: SelectableNode[];
    onDrop: (node: SelectableNode, index: number) => void;
  }

  const { nodes = $bindable(), onDrop }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
  const droppable = ctx.createDroppable(nodeCtx, {
    accept: selectableNode,
    onDrop(node) {
      onDrop(node, 0);
    },
  });
</script>

{#if nodes.length === 0}
  <DropZone placeholder="Drop form elements here" {droppable} />
{:else}
  {#each nodes as nodeId, i (nodeId)}
    <DropIndicator
      onDrop={(node) => {
        onDrop(node, i);
      }}
    />
    <RootNode
      bind:node={nodes[i]}
      unmount={() => {
        nodes.splice(i, 1);
      }}
    />
  {/each}
  <DropIndicator
    onDrop={(node) => {
      onDrop(node, nodes.length);
    }}
  />
{/if}
