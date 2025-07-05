<script lang="ts">
  import type { NodeId } from "$lib/builder/node.js";
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    properties: Map<NodeId, string>;
    value: NodeId | undefined;
  }

  let { properties, value = $bindable() }: Props = $props();
</script>

<Select.Root type="single" disabled={properties.size === 0} bind:value>
  <Select.Trigger class="w-full">
    {(value !== undefined ? properties.get(value) : undefined) ??
      "Select some property"}
  </Select.Trigger>
  <Select.Content>
    {#each properties as [id, title] (id)}
      <Select.Item value={id}>{title}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
