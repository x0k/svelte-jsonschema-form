<script lang="ts">
  import type { WidgetProps } from "@/components/form";
  import Datalist, { dataListOptions } from './datalist.svelte';

  let { value = $bindable(), attributes, config }: WidgetProps<"number"> = $props();
  const options = $derived(dataListOptions(config))
</script>

{#if attributes.type === "range"}
  <span style="padding: 0 1rem; min-width: 3ex;" >
    {value}
  </span>
{/if}
<input
  type="number"
  bind:value
  style="flex-grow: 1"
  list={options?.id}
  {...attributes}
/>
<Datalist {options} />
