<script lang="ts" generics="T extends string">
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    label: string;
    value: T;
    items: T[];
  }

  let { value = $bindable(), items, label }: Props = $props();
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
  <Select.Trigger>
    {value}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>{label}</Select.Label>
      {#each items as item (item)}
        <Select.Item value={item} label={item}>
          {item}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
