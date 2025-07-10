<script lang="ts">
  import { summarizeOperator, type NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import {
    getBuilderContext,
    type ReadonlyNodeRef,
  } from "../../context.svelte.js";
  import NodeHeader from "../../node-header.svelte";
  import NodeContainer from "../../node-container.svelte";
  import NodeIssues from '../../node-issues.svelte';

  import OperatorDropzone from "./operator-dropzone.svelte";
  import { getPredicateContext } from "./context.js";

  let {
    draggable,
    node = $bindable(),
    unmount,
  }: NodeProps<NodeType.Predicate> = $props();

  const ctx = getBuilderContext();
  const pCtx = getPredicateContext();

  const nodeRef: ReadonlyNodeRef = {
    get current() {
      return pCtx.node;
    },
  };

  const isSelected = $derived(ctx.selectedNode?.id === node.id);
  const r = $derived(
    node.operator && ctx.summarizeOperator(node.operator, pCtx.node)
  );
</script>

{#snippet append()}
  <span class="text-muted-foreground">{r ? r.value : "Select to edit"}</span>
{/snippet}
<NodeContainer
  bind:node
  {draggable}
  status={r?.status}
  showRequired={false}
  onSelect={() => {
    ctx.selectAffectedNode(nodeRef);
  }}
>
  <NodeHeader
    {draggable}
    {unmount}
    append={isSelected ? undefined : append}
    disablePadding>Predicate</NodeHeader
  >
  {#if ctx.selectedNode?.id === node.id}
    <OperatorDropzone bind:node={node.operator} />
    <NodeIssues class="pt-4" {node} />
  {/if}
</NodeContainer>
