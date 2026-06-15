<script lang="ts">
  import { untrack } from "svelte";
  import Plus from "@lucide/svelte/icons/plus";

  import { getNodeOptions, type InOperator } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import RemoveButton from "../../remove-button.svelte";

  import { getPredicateContext } from "./context.js";
  import NodeOptionInput from "./node-option-input.svelte";

  interface Props {
    node: InOperator;
  }

  let { node = $bindable() }: Props = $props();

  const pCtx = getPredicateContext();

  const options = $derived(getNodeOptions(pCtx.node));

  $effect(() => {
    if (options.length === 0) {
      return;
    }
    untrack(() => {
      const values = new Set(options.map((o) => o.value));
      node.values = node.values.filter((v) => values.has(v));
    });
  });

  let value = $state("");
  let input: NodeOptionInput;

  function pushItem() {
    node.values.push(value);
    value = "";
    input.focus();
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2">
    <NodeOptionInput
      bind:this={input}
      {options}
      bind:value
      onEnter={pushItem}
    />
    {#if options.length === 0}
      <Button variant="outline" size="icon" class="size-8" onclick={pushItem}>
        <Plus class="size-4" />
      </Button>
    {/if}
  </div>
  {#each node.values as _, i}
    <div class="flex items-center gap-2">
      <NodeOptionInput {options} bind:value={node.values[i]} />
      <RemoveButton
        onClick={() => {
          node.values.splice(i, 1);
        }}
      />
    </div>
  {/each}
</div>
