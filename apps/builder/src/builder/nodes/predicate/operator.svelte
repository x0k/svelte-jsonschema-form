<script lang="ts">
  import {
    isNOperator,
    isNotOperator,
    OPERATOR_TITLES,
    type NodeType,
    type NOperator,
  } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import { isOperatorNode } from "../../context.svelte.js";
  import Header from "../../header.svelte";
  import Container from "../../container.svelte";
  import MultiDropzone from "../../multi-dropzone.svelte";

  import OperatorDropzone from "./operator-dropzone.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Operator> = $props();

  const isMulti = $derived(isNOperator(node));
</script>

<Container bind:node {draggable}>
  <Header {draggable} {unmount} disablePadding={isMulti}>
    {OPERATOR_TITLES[node.op]}
  </Header>
  {#if isNOperator(node)}
    <MultiDropzone
      bind:nodes={node.operands}
      accept={isOperatorNode}
      onDrop={(newNode, index) => {
        (node as NOperator).operands.splice(index, 0, newNode);
      }}
    />
  {:else if isNotOperator(node)}
    <OperatorDropzone bind:node={node.operand} />
  {/if}
</Container>
