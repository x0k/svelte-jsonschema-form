<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";
  import NodeHeader from "../node-header.svelte";
  import SingleDropZone from "../single-drop-zone.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Array> = $props();
</script>

<NodeHeader {node} {draggable} {unmount} />
<SingleDropZone bind:node={node.item} />
