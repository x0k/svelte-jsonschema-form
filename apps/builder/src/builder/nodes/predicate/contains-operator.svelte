<script lang="ts">
  import {
    getNodeChild,
    type ContainsOperator,
    type Node,
    type OperatorNode,
    isOperatorNode,
    isContainsOperator,
  } from "$lib/builder/index.js";

  import { getPredicateContext, setPredicateContext } from "./context.js";
  import OperatorDropzone from "./operator-dropzone.svelte";

  interface Props {
    node: ContainsOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const child = $derived(getNodeChild(pCtx.node));

  setPredicateContext({
    get node() {
      return child!;
    },
  });
</script>

{#if child}
  <OperatorDropzone
    bind:node={node.operand}
    createAccept={(applicableOperators) =>
      (node: Node): node is OperatorNode =>
        isOperatorNode(node) &&
        applicableOperators.has(node.op) &&
        (!isContainsOperator(node) || child !== pCtx.node)}
  />
{:else}
  <div class="text-destructive">
    First, define the child element of the list
  </div>
{/if}
