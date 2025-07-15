<script lang="ts">
  import { untrack } from "svelte";

  import {
    getNodeProperties,
    getNodeProperty,
    type PropertyOperator,
  } from "$lib/builder/index.js";

  import { getPredicateContext, setPredicateContext } from "./context.js";
  import OperatorDropzone from "./operator-dropzone.svelte";
  import PropertySelect from "./property-select.svelte";

  interface Props {
    node: PropertyOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const properties = $derived(getNodeProperties(pCtx.node));
  const selectedNode = $derived(
    node.propertyId !== undefined
      ? getNodeProperty(pCtx.node, node.propertyId)
      : undefined
  );

  $effect(() => {
    properties;
    untrack(() => {
      const pId = node.propertyId;
      if (pId === undefined || properties.has(pId)) {
        return;
      }
      node.propertyId = undefined;
      node.operator = undefined;
    });
  });

  setPredicateContext({
    get node() {
      return selectedNode!;
    },
  });
</script>

<div class="flex flex-col gap-2">
  <PropertySelect bind:value={node.propertyId} {properties} />
  {#if selectedNode}
    <OperatorDropzone bind:node={node.operator} />
  {/if}
</div>
