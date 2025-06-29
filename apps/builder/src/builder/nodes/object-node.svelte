<script lang="ts">
  import type { NodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import MultiDropZone from "../multi-drop-zone.svelte";
  import NodeHeader from "../node-header.svelte";
  import RootNode from "../root-node.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Object> = $props();
</script>

<NodeHeader {node} {draggable} {unmount} />
<MultiDropZone bind:nodes={node.children}>
  {#snippet item(i)}
    <RootNode
      bind:node={node.children[i]}
      unmount={() => {
        node.children.splice(i, 1);
      }}
    />
  {/snippet}
</MultiDropZone>
