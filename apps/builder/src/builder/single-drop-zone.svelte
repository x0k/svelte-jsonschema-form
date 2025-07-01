<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    getNodeContext,
    isObjectPropertyNode,
    isCustomizableOrPropertyNode,
    type NodeRef,
  } from "./context.svelte.js";
  import DropZone from "./drop-zone.svelte";
  import RootNode from "./root-node.svelte";

  interface Props {
    node: Node | undefined;
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
</script>

{#if node}
  <RootNode bind:node unmount={() => (node = undefined)} />
{:else}
  {@const droppable = ctx.createDroppable(nodeCtx, {
    accept: isCustomizableOrPropertyNode,
    onDrop(newNode) {
      node = isObjectPropertyNode(newNode) ? newNode.property : newNode;
      ctx.selectNode(nodeRef);
    },
  })}
  <DropZone {placeholder} {droppable} />
{/if}
