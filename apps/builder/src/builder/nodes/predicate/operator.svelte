<script lang="ts">
  import { type NodeType, OPERATOR_TITLES } from "meta/builder";

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
    type NOperator,
    isHasPropertyOperator,
    isContainsOperator,
  } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import MultiDropzone from "../../multi-dropzone.svelte";
  import NodeContainer from "../../node-container.svelte";
  import NodeHeader from "../../node-header.svelte";
  import NodeIssues from "../../node-issues.svelte";
  import ComparisonOperator from "./comparison-operator.svelte";
  import ContainsOperator from "./contains-operator.svelte";
  import EqOperator from "./eq-operator.svelte";
  import HasPropertyOperator from "./has-property-operator.svelte";
  import InOperator from "./in-operator.svelte";
  import OperatorDropzone from "./operator-dropzone.svelte";
  import PatternOperator from "./pattern-operator.svelte";
  import PropertyOperator from "./property-operator.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Operator> = $props();

  const isMultiOrEmpty = $derived(
    isNOperator(node) || isUniqueItemsOperator(node)
  );
</script>

<NodeContainer bind:node {draggable} showRequired={false} disableSelection>
  <NodeHeader {draggable} {unmount} disablePadding={isMultiOrEmpty}>
    {OPERATOR_TITLES[node.op]}
  </NodeHeader>
  {#if isNOperator(node)}
    <MultiDropzone
      showRequired={false}
      bind:nodes={node.operands}
      accept={isOperatorNode}
      onDrop={(newNode, index) => {
        (node as NOperator).operands.splice(index, 0, newNode);
      }}
    />
  {:else if isContainsOperator(node)}
    <ContainsOperator bind:node />
  {:else if isUOperator(node)}
    <OperatorDropzone bind:node={node.operand} />
  {:else if isSOperator(node)}
    <PatternOperator bind:node />
  {:else if isComparisonOperator(node)}
    <ComparisonOperator bind:node />
  {:else if isEqOperator(node)}
    <EqOperator bind:node />
  {:else if isInOperator(node)}
    <InOperator bind:node />
  {:else if isPropertyOperator(node)}
    <PropertyOperator bind:node />
  {:else if isHasPropertyOperator(node)}
    <HasPropertyOperator bind:node />
  {/if}
  <NodeIssues class="pt-4" {node} />
</NodeContainer>
