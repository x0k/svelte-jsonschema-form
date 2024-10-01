<script lang="ts">
  import { type WidgetProps } from "@/components/form";

  import Datalist, { dataListOptions } from "./datalist.svelte";

  let {
    value = $bindable(),
    attributes,
    config,
  }: WidgetProps<"text"> = $props();

  const options = $derived(dataListOptions(config));
</script>

<input
  type="text"
  bind:value
  style="flex-grow: 1"
  list={options?.id}
  {...attributes}
/>
<Datalist {options} />
