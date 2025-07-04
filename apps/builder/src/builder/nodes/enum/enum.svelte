<script lang="ts">
  import {
    ENUM_VALUE_TYPE_TITLES,
    ENUM_VALUE_TYPES,
    type NodeType,
  } from "$lib/builder/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";

  import type { NodeProps } from "../../model.js";
  import NodeContainer from "../../node-container.svelte";
  import NodeHeader from "../../node-header.svelte";

  import EnumItems from "./enum-items.svelte";
  import ValueTypeSelect from "./value-type-select.svelte";

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
      <ValueTypeSelect bind:value={node.valueType} />
    {/snippet}
  </NodeHeader>
  <EnumItems bind:items={node.items} valueType={node.valueType} />
</NodeContainer>
