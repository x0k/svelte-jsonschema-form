<script lang="ts">
  import { getNodeOptions, type EqOperator } from "$lib/builder/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  import { getPredicateContext } from "./context.js";
  import NodeOptionSelect from "./node-option-select.svelte";

  interface Props {
    node: EqOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const options = $derived(getNodeOptions(pCtx.node));
</script>

{#if options.length > 0}
  <NodeOptionSelect {options} bind:value={node.value} />
{:else}
  <Input placeholder="Input JSON value" bind:value={node.value} />
{/if}
