<script lang="ts">
  import type { NodeOption } from "$lib/builder/index.js";
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    options: NodeOption[];
    value: string;
  }

  let { options, value = $bindable() }: Props = $props();
</script>

<Select.Root type="single" disabled={options.length === 0} bind:value>
  <Select.Trigger class="w-full">
    {options.find((o) => o.value === value)?.label ?? "Select some option"}
  </Select.Trigger>
  <Select.Content>
    {#each options as option (option.id)}
      <Select.Item value={option.value}>{option.label}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
