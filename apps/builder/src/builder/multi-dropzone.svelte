<script lang="ts" generics="N extends Node">
  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext } from "./context.svelte.js";
  import { getNodeContext } from "./node-context.js";
  import DropZone from "./drop-zone.svelte";
  import DropIndicator from "./drop-indicator.svelte";
  import RootNode from "./root-node.svelte";
  import Index from "./index.svelte";

  interface Props {
    nodes: Node[];
    onDrop: (node: N, index: number) => void;
    accept: (node: Node) => node is N;
    showRequired: boolean;
  }

  const { showRequired, nodes = $bindable(), onDrop, accept }: Props = $props();

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
  <DropZone {droppable}>
    {#snippet placeholder()}
      Drop form elements here
    {/snippet}
  </DropZone>
{:else}
  {#each nodes as nodeId, i (nodeId)}
    <DropIndicator
      {accept}
      onDrop={(node) => {
        onDrop(node, i);
      }}
    />
    <Index index={i}>
      <RootNode
        {showRequired}
        bind:node={nodes[i]}
        unmount={() => {
          nodes.splice(i, 1);
        }}
      />
    </Index>
  {/each}
  <DropIndicator
    {accept}
    onDrop={(node) => {
      onDrop(node, nodes.length);
    }}
  />
{/if}
