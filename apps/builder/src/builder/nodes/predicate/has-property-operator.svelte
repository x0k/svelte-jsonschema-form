<script lang="ts">
  import {
    getNodeProperties,
    type HasPropertyOperator,
  } from "$lib/builder/index.js";
  import { untrack } from "svelte";

  import { getPredicateContext } from "./context.js";
  import PropertySelect from "./property-select.svelte";

  interface Props {
    node: HasPropertyOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const properties = $derived(getNodeProperties(pCtx.node));

  $effect(() => {
    properties;
    untrack(() => {
      const pId = node.propertyId;
      if (pId === undefined || properties.has(pId)) {
        return;
      }
      node.propertyId = undefined;
    });
  });
</script>

<PropertySelect bind:value={node.propertyId} {properties} />
