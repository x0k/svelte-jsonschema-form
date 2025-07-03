<script lang="ts">
  import type { OperatorNode } from "$lib/builder/builder.js";

  import {
    getBuilderContext,
    getNodeContext,
    isOperatorNode,
  } from "../../context.svelte.js";
  import DropZone from "../../drop-zone.svelte";

  import Operator from "./operator.svelte";

  interface Props {
    node: OperatorNode | undefined;
  }

  let { node = $bindable() }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
</script>

{#if node}
  {@const unmount = () => {
    node = undefined;
  }}
  {@const draggable = ctx.createDraggable({
    unmount,
    get node() {
      return node!;
    },
  })}
  <Operator bind:node {unmount} {draggable} />
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
