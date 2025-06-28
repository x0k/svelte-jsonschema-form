<script lang="ts">
  import {
    ENUM_VALUE_TYPE_TITLES,
    ENUM_VALUE_TYPES,
    type NodeType,
  } from "$lib/builder/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import EnumItems from "../enum-items.svelte";

  import type { NodeProps } from "../model.js";
  import NodeHeader from "../node-header.svelte";

  let {
    node = $bindable(),
    handle,
    unmount,
  }: NodeProps<NodeType.Enum> = $props();
</script>

{#snippet append()}
  <label class="flex gap-2 items-center">
    Value type
    <Select.Root type="single" bind:value={node.valueType}>
      <Select.Trigger size="sm">
        {ENUM_VALUE_TYPE_TITLES[node.valueType]}
      </Select.Trigger>
      <Select.Content>
        {#each ENUM_VALUE_TYPES as t (t)}
          <Select.Item value={t}>{ENUM_VALUE_TYPE_TITLES[t]}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </label>
{/snippet}
<NodeHeader {node} {handle} {unmount} {append} />
<EnumItems bind:items={node.items} valueType={node.valueType} />
