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
    draggable,
    unmount,
  }: NodeProps<NodeType.Enum> = $props();

  const selectId = $props.id();
</script>

{#snippet append()}
  <div class="flex gap-2 items-center">
    <label for={selectId}> Value type </label>
    <Select.Root type="single" bind:value={node.valueType}>
      <Select.Trigger id={selectId} size="sm">
        {ENUM_VALUE_TYPE_TITLES[node.valueType]}
      </Select.Trigger>
      <Select.Content>
        {#each ENUM_VALUE_TYPES as t (t)}
          <Select.Item value={t}>{ENUM_VALUE_TYPE_TITLES[t]}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
{/snippet}
<NodeHeader {node} {draggable} {unmount} {append} />
<EnumItems bind:items={node.items} valueType={node.valueType} />
