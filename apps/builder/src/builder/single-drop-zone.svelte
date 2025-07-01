<script lang="ts">
  import type { SelectableNode } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    getNodeContext,
    selectableNode,
    type NodeRef,
  } from "./context.svelte.js";
  import DropZone from "./drop-zone.svelte";
  import RootNode from './root-node.svelte';

  interface Props {
    node: SelectableNode | undefined;
    placeholder?: string;
  }

  let { node = $bindable(), placeholder = "Drop form element here" }: Props =
    $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
  const nodeRef: NodeRef = {
    current() {
      return node;
    },
    update(n) {
      node = n;
    },
  };
  const droppable = ctx.createDroppable(nodeCtx, {
    accept: selectableNode,
    onDrop(newNode) {
      node = newNode;
      ctx.selectNode(nodeRef);
    },
  });
</script>

{#if node}
  <RootNode bind:node unmount={() => (node = undefined)} />
{:else}
  <DropZone {placeholder} {droppable} />
{/if}
