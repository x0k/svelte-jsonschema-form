<script lang="ts">
  import {
    isNOperator,
    type NodeType,
    type NOperator,
  } from "$lib/builder/builder.js";

  import type { NodeProps } from "../../model.js";
  import { isOperatorNode } from "../../context.svelte.js";
  import Header from "../../header.svelte";
  import Container from "../../container.svelte";
  import MultiDropzone from "../../multi-dropzone.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Operator> = $props();

  const isMulti = $derived(isNOperator(node));
</script>

<Container bind:node {draggable}>
  <Header {draggable} {unmount} disablePadding={isMulti}>
    {node.op}
  </Header>
  {#if isNOperator(node)}
    <MultiDropzone
      bind:nodes={node.operands}
      accept={isOperatorNode}
      onDrop={(newNode, index) => {
        (node as NOperator).operands.splice(index, 0, newNode);
      }}
    />
  {/if}
</Container>
