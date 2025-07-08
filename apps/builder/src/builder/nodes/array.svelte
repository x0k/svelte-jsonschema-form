<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import NodeContainer from "../node-container.svelte";
  import NodeHeader from "../customizable-node-header.svelte";
  import SingleDropZone from "../single-dropzone.svelte";
  import NodeIssues from "../node-issues.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
  }: NodeProps<NodeType.Array> = $props();
</script>

<NodeContainer
  bind:node
  {draggable}
  {showRequired}
  class="flex flex-col gap-0.5"
>
  <NodeHeader {node} {draggable} {unmount} {showRequired} />
  <SingleDropZone bind:node={node.item} showRequired={false} />
  <NodeIssues class="pt-3" {node} />
</NodeContainer>
