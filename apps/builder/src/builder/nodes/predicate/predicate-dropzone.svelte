<script lang="ts">
  import {
    createPredicate,
    type ObjectPropertyDependencyNode,
    type PredicateNode,
  } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import {
    getBuilderContext,
    getNodeContext,
    isPredicateNode,
    type NodeRef,
  } from "../../context.svelte.js";
  import DropZone from "../../drop-zone.svelte";

  import Predicate from "./predicate.svelte";

  interface Props {
    node: ObjectPropertyDependencyNode;
  }

  let { node = $bindable() }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
  const nodeRef: NodeRef = {
    current() {
      return node.predicate;
    },
    update(n) {
      node.predicate = n as PredicateNode;
    },
  };
</script>

{#if node.predicate}
  {@const unmount = () => {
    node.predicate = undefined;
  }}
  {@const draggable = ctx.createDraggable({
    unmount,
    get node() {
      return node.predicate!;
    },
  })}
  <Predicate {draggable} bind:node={node.predicate} {unmount} />
{:else}
  {@const droppable = ctx.createDroppable(nodeCtx, {
    accept: isPredicateNode,
    onDrop(n) {
      node.predicate = n;
      ctx.selectNode(nodeRef)
    },
  })}
  <DropZone {droppable}>
    {#snippet placeholder()}
      Drop predicate here or <Button
        onclick={(e) => {
          e.stopPropagation();
          node.predicate = createPredicate();
          ctx.selectNode(nodeRef)
        }}>Create one</Button
      >
    {/snippet}
  </DropZone>
{/if}
