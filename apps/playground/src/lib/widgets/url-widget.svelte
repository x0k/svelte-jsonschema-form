<script lang="ts">
  import type { WidgetProps } from "@/components/form";
  import Datalist, { dataListOptions } from "./datalist.svelte";

  let {
    attributes,
    value = $bindable(),
    config,
  }: WidgetProps<"email"> = $props();
  const options = $derived(dataListOptions(config));
</script>

<input
  type="url"
  bind:value
  style="flex-grow: 1"
  list={options?.id}
  {...attributes}
/>
<Datalist {options} />
