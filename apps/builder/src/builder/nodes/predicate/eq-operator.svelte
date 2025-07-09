<script lang="ts">
  import { getNodeOptions, type EqOperator } from "$lib/builder/index.js";

  import { getPredicateContext } from "./context.js";
  import NodeOptionInput from "./node-option-input.svelte";

  interface Props {
    node: EqOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const options = $derived(getNodeOptions(pCtx.node));
</script>

<div class="flex">
  <NodeOptionInput bind:value={node.value} {options} />
</div>
