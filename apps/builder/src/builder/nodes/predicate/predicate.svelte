<script lang="ts">
  import { stringifyOperator, type NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import { getBuilderContext } from "../../context.svelte.js";
  import Container from "../../container.svelte";
  import Header from "../../header.svelte";

  import OperatorDropzone from "./operator-dropzone.svelte";

  let {
    draggable,
    node = $bindable(),
    unmount,
  }: NodeProps<NodeType.Predicate> = $props();

  const ctx = getBuilderContext();

  const isSelected = $derived(ctx.selectedNode?.id === node.id);
  const r = $derived(node.operator && stringifyOperator(node.operator));
</script>

{#snippet append()}
  <span class="text-muted-foreground">{r ? r.value : "Select to edit"}</span>
{/snippet}
<Container bind:node {draggable} invalid={r?.ok === false}>
  <Header
    {draggable}
    {unmount}
    append={isSelected ? undefined : append}
    disablePadding>Predicate</Header
  >
  {#if ctx.selectedNode?.id === node.id}
    <OperatorDropzone bind:node={node.operator} />
  {/if}
</Container>
