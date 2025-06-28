<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import MultiDropZone from "../multi-drop-zone.svelte";
  import NodeHeader from "../node-header.svelte";

  let {
    node = $bindable(),
    handle,
    unmount,
  }: NodeProps<NodeType.Object> = $props();
</script>

<NodeHeader {node} {handle} {unmount} />
<MultiDropZone bind:nodes={node.children} />
