<script>
  import { createNode, createOperatorNode, NodeType, OperatorType } from "$lib/builder/index.js";
  
  import { getBuilderContext } from './context.svelte.js';
  import NodeFactory from "./node-factory.svelte";

  const ctx = getBuilderContext()
</script>

<div class="flex flex-col gap-2">
  {#if ctx.selectedNode?.type === NodeType.Predicate}
    <NodeFactory createNode={() => createOperatorNode(OperatorType.And)} title="And" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.Or)} title="Or" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.Xor)} title="Xor" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.Not)} title="Not" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.Eq)} title="Eq" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.In)} title="In" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.Less)} title="Less" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.LessOrEq)} title="LessOrEq" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.Greater)} title="Greater" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.GreaterOrEq)} title="GreaterOrEq" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.MultipleOf)} title="MultipleOf" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.MinLength)} title="MinLength" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.MaxLength)} title="MaxLength" />
    <NodeFactory createNode={() => createOperatorNode(OperatorType.Pattern)} title="Pattern" />
  {:else}
    <NodeFactory createNode={() => createNode(NodeType.Object)} title="Group" />
    <NodeFactory createNode={() => createNode(NodeType.Array)} title="List" />
    <NodeFactory createNode={() => createNode(NodeType.Grid)} title="Grid" />
    <NodeFactory createNode={() => createNode(NodeType.Enum)} title="Enum" />
    <NodeFactory createNode={() => createNode(NodeType.String)} title="String" />
  {/if}
</div>
