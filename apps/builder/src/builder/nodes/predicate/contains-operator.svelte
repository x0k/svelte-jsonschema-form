<script lang="ts">
  import { getNodeChild, type ContainsOperator } from "$lib/builder/index.js";

  import { getPredicateContext, setPredicateContext } from "./context.js";
  import OperatorDropzone from "./operator-dropzone.svelte";

  interface Props {
    node: ContainsOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const child = $derived(getNodeChild(pCtx.node));

  setPredicateContext({
    get node() {
      return child!;
    }
  });
</script>

{#if child}
  <OperatorDropzone bind:node={node.operand} />
{:else}
  <div class="text-destructive">
    First, define the child element of the list
  </div>
{/if}
