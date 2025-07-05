<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import NodeContainer from "../../node-container.svelte";
  import NodeHeader from "../../node-header.svelte";

  import EnumItems from "./enum-items.svelte";
  import ValueTypeSelect from "./value-type-select.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Enum> | NodeProps<NodeType.MultiEnum> = $props();
</script>

<NodeContainer bind:node {draggable}>
  <NodeHeader {node} {draggable} {unmount}>
    {#snippet append()}
      <ValueTypeSelect bind:value={node.valueType} />
    {/snippet}
  </NodeHeader>
  <EnumItems bind:items={node.items} valueType={node.valueType} />
</NodeContainer>
