<script lang="ts" generics="T extends string">
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    label: string;
    value: T;
    items: Iterable<T>;
    itemLabel?: (item: T) => string;
    labels?: Record<T, string>;
  }

  let {
    value = $bindable(),
    items,
    label,
    labels,
    itemLabel,
  }: Props = $props();

  const itemsArray = $derived(Array.isArray(items) ? items : Array.from(items))

  function lbl(item: T) {
    return itemLabel?.(item) ?? labels?.[item] ?? item
  }
</script>

<Select.Root type="single" bind:value>
  <Select.Trigger class="truncate">
    {lbl(value)}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>{label}</Select.Label>
      {#each itemsArray as item (item)}
        <Select.Item value={item} label={item}>
          {lbl(item)}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
