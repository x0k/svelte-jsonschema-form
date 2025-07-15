<script lang="ts" generics="T extends string">
  import type { ClassValue } from "svelte/elements";

  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    labelId?: string;
    value: T;
    items: T[];
    labels?: Record<T, string>;
    class?: ClassValue;
  }

  let {
    value = $bindable(),
    items,
    labelId,
    labels,
    class: className,
  }: Props = $props();
</script>

<Select.Root type="single" bind:value>
  <Select.Trigger id={labelId} class={className}>
    {labels?.[value] ?? value}
  </Select.Trigger>
  <Select.Content>
    {#each items as item (item)}
      <Select.Item value={item} label={item}>
        {labels?.[item] ?? item}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
