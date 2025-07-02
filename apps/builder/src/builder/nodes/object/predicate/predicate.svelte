<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../../../model.js";
  import { getBuilderContext } from "../../../context.svelte.js";
  import Container from "../../../container.svelte";
  import Header from "../../../header.svelte";

  import OperatorDropzone from "./operator-dropzone.svelte";

  let {
    draggable,
    node = $bindable(),
    unmount,
  }: NodeProps<NodeType.Predicate> = $props();

  const ctx = getBuilderContext();

  const isSelected = $derived(ctx.selectedNode?.id === node.id);
</script>

<Container bind:node {draggable}>
  <Header {draggable} {unmount} disablePadding>
    Predicate
    {#snippet append()}
      {#if !isSelected && node.operator === undefined}
        <span class="text-muted-foreground">Select to edit</span>
      {/if}
    {/snippet}
  </Header>
  {#if ctx.selectedNode?.id === node.id}
    <OperatorDropzone bind:node={node.operator} />
  {/if}
</Container>
