<script lang="ts">
  import {
    isComparisonOperator,
    isEqOperator,
    isInOperator,
    isNOperator,
    isPropertyOperator,
    isSOperator,
    isUniqueItemsOperator,
    isUOperator,
    isOperatorNode,
    OPERATOR_TITLES,
    type NodeType,
    type NOperator,
  } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import Header from "../../header.svelte";
  import Container from "../../container.svelte";
  import MultiDropzone from "../../multi-dropzone.svelte";
  import ValueTypeSelect from "../enum/value-type-select.svelte";

  import OperatorDropzone from "./operator-dropzone.svelte";
  import PatternOperator from "./pattern-operator.svelte";
  import ComparisonOperator from "./comparison-operator.svelte";
  import EqOperator from "./eq-operator.svelte";
  import PropertyOperator from "./property-operator.svelte";
  import { setPredicateContext } from "./context.js";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Operator> = $props();

  const isMultiOrEmpty = $derived(
    isNOperator(node) || isUniqueItemsOperator(node)
  );
</script>

<Container bind:node {draggable} disableSelection>
  <Header {draggable} {unmount} disablePadding={isMultiOrEmpty}>
    {OPERATOR_TITLES[node.op]}
    {#snippet append()}
      {#if isEqOperator(node) || isInOperator(node)}
        <ValueTypeSelect bind:value={node.valueType} />
      {/if}
    {/snippet}
  </Header>
  {#if isNOperator(node)}
    <MultiDropzone
      bind:nodes={node.operands}
      accept={isOperatorNode}
      onDrop={(newNode, index) => {
        (node as NOperator).operands.splice(index, 0, newNode);
      }}
    />
  {:else if isUOperator(node)}
    <OperatorDropzone bind:node={node.operand} />
  {:else if isSOperator(node)}
    <PatternOperator bind:node />
  {:else if isComparisonOperator(node)}
    <ComparisonOperator bind:node />
  {:else if isEqOperator(node)}
    <EqOperator bind:node />
  {:else if isPropertyOperator(node)}
    <PropertyOperator bind:node />
  {/if}
</Container>
