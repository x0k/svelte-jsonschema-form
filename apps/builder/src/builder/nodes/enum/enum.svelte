<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import NodeContainer from "../../node-container.svelte";
  import NodeHeader from "../../customizable-node-header.svelte";
  import NodeIssues from '../../node-issues.svelte';

  import EnumItems from "./enum-items.svelte";
  import ValueTypeSelect from "./value-type-select.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
  }: NodeProps<NodeType.Enum> | NodeProps<NodeType.MultiEnum> = $props();
</script>

<NodeContainer
  bind:node
  {draggable}
  {showRequired}
  class="flex flex-col gap-0.5"
>
  <NodeHeader {node} {draggable} {unmount} {showRequired}>
    {#snippet append()}
      <ValueTypeSelect bind:value={node.valueType} />
    {/snippet}
  </NodeHeader>
  <EnumItems bind:items={node.items} valueType={node.valueType} />
  <NodeIssues {node} />
</NodeContainer>
