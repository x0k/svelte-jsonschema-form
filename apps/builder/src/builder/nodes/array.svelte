<script lang="ts">
  import type { NodeType } from "meta/builder";

  import NodeHeader from "../customizable-node-header.svelte";
  import type { NodeProps } from "../model.js";
  import NodeContainer from "../node-container.svelte";
  import NodeIssues from "../node-issues.svelte";
  import SingleDropZone from "../single-dropzone.svelte";

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
