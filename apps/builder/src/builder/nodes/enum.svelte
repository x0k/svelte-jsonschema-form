<script lang="ts">
  import {
    ENUM_VALUE_TYPE_TITLES,
    ENUM_VALUE_TYPES,
    type NodeType,
  } from "$lib/builder/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  
  import type { NodeProps } from "../model.js";
  import NodeContainer from "../node-container.svelte";
  import NodeHeader from "../node-header.svelte";
  import EnumItems from "../enum-items.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Enum> = $props();

  const selectId = $props.id();
</script>

<NodeContainer bind:node {draggable}>
  <NodeHeader {node} {draggable} {unmount}>
    {#snippet append()}
      <div class="flex gap-2 items-center">
        <label class="text-muted-foreground" for={selectId}> Value type </label>
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
  </NodeHeader>
  <EnumItems bind:items={node.items} valueType={node.valueType} />
</NodeContainer>
