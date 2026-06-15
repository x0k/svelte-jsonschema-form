<script lang="ts" generics="T extends string">
  import type { ClassValue } from "svelte/elements";

  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    labelId?: string;
    value: T;
    items: Iterable<T>;
    itemLabel?: (item: T) => string;
    labels?: Record<T, string>;
    class?: ClassValue;
  }

  let {
    value = $bindable(),
    items,
    labelId,
    labels,
    itemLabel,
    class: className,
  }: Props = $props();

  const itemsArray = $derived(Array.isArray(items) ? items : Array.from(items));

  function lbl(item: T) {
    return itemLabel?.(item) ?? labels?.[item] ?? item;
  }
</script>

<Select.Root type="single" bind:value>
  <Select.Trigger id={labelId} class={className}>
    {lbl(value)}
  </Select.Trigger>
  <Select.Content>
    {#each itemsArray as item (item)}
      <Select.Item value={item}>
        {lbl(item)}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
