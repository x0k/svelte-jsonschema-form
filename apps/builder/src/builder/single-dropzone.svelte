<script lang="ts">
  import type { Snippet } from "svelte";

  import {
    type Node,
    isCustomizableOrPropertyNode,
    isObjectPropertyNode,
  } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    type NodeRef,
  } from "./context.svelte.js";
  import DropZone from "./drop-zone.svelte";
  import RootNode from "./root-node.svelte";
  import { getNodeContext } from './node-context.js';

  interface Props {
    node: Node | undefined;
    placeholder?: Snippet;
    showRequired: boolean;
  }

  let {
    node = $bindable(),
    placeholder = defaultPlaceholder,
    showRequired,
  }: Props = $props();

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
  <RootNode bind:node unmount={() => (node = undefined)} {showRequired} />
{:else}
  {@const droppable = ctx.createDroppable(nodeCtx, {
    accept: isCustomizableOrPropertyNode,
    onDrop(newNode) {
      node = isObjectPropertyNode(newNode) ? newNode.property : newNode;
      ctx.selectNode(nodeRef, showRequired);
    },
  })}
  <DropZone {placeholder} {droppable} />
{/if}
{#snippet defaultPlaceholder()}
  Drop form element here
{/snippet}
