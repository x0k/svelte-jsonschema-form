<script lang="ts">
  import type { OperatorNode } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    getNodeContext,
    isOperatorNode,
  } from "../../context.svelte.js";
  import DropZone from "../../drop-zone.svelte";
  import RootNode from "../../root-node.svelte";

  interface Props {
    node: OperatorNode | undefined;
  }

  let { node = $bindable() }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
</script>

{#if node}
  <RootNode
    bind:node
    unmount={() => {
      node = undefined;
    }}
  />
{:else}
  {@const droppable = ctx.createDroppable(nodeCtx, {
    accept: isOperatorNode,
    onDrop(n) {
      node = n;
    },
  })}
  <DropZone {droppable}>
    {#snippet placeholder()}
      Drop operator here
    {/snippet}
  </DropZone>
{/if}
