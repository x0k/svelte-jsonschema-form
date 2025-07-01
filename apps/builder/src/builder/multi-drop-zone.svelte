<script lang="ts" generics="N extends Node">
  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext, getNodeContext } from "./context.svelte.js";
  import DropZone from "./drop-zone.svelte";
  import DropIndicator from "./drop-indicator.svelte";
  import RootNode from "./root-node.svelte";

  interface Props {
    nodes: Node[];
    onDrop: (node: N, index: number) => void;
    accept: (node: Node) => node is N;
  }

  const { nodes = $bindable(), onDrop, accept }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
</script>

{#if nodes.length === 0}
  {@const droppable = ctx.createDroppable(nodeCtx, {
    accept,
    onDrop(node) {
      onDrop(node, 0);
    },
  })}
  <DropZone placeholder="Drop form elements here" {droppable} />
{:else}
  {#each nodes as nodeId, i (nodeId)}
    <DropIndicator
      {accept}
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
    {accept}
    onDrop={(node) => {
      onDrop(node, nodes.length);
    }}
  />
{/if}
