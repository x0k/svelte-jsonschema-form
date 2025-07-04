<script lang="ts">
  import {
    getNodeProperties,
    getNodeTitle,
    isObjectNode,
    type PropertyOperator,
  } from "$lib/builder/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { untrack } from "svelte";

  import { getPredicateContext, setPredicateContext } from "./context.js";
  import OperatorDropzone from "./operator-dropzone.svelte";

  interface Props {
    node: PropertyOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const n = $derived(pCtx.node);

  const properties = $derived(getNodeProperties(n));

  $effect(() => {
    const pId = node.propertyId;
    if (pId === undefined || properties.has(pId)) {
      return;
    }
    node.propertyId = undefined;
    node.operator = undefined;
  });

  const selectedNode = $derived(
    node.propertyId !== undefined && isObjectNode(n)
      ? n.properties.find((p) => p.id === node.propertyId)?.property
      : undefined
  );
  setPredicateContext({
    get node() {
      return selectedNode!;
    },
  });
</script>

<div class="flex flex-col gap-2">
  <Select.Root
    type="single"
    disabled={properties.size === 0}
    bind:value={node.propertyId}
  >
    <Select.Trigger class="w-full">
      {(selectedNode && getNodeTitle(selectedNode)) ?? "Select some property"}
    </Select.Trigger>
    <Select.Content>
      {#each properties as [id, title] (id)}
        <Select.Item value={id}>{title}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  {#if selectedNode}
    <OperatorDropzone bind:node={node.operator} />
  {/if}
</div>
