<script lang="ts">
  import type { NodeType, SelectableNode } from "$lib/builder/index.js";

  import type { NodeProps } from "../model.js";
  import { getBuilderContext, selectableNode } from "../context.svelte.js";
  import MultiDropZone from "../multi-drop-zone.svelte";
  import NodeHeader from "../node-header.svelte";
  import NodeContainer from "../node-container.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Object> = $props();

  const ctx = getBuilderContext();

  const onDrop = (newNode: SelectableNode, index: number) => {
    node.properties.splice(index, 0, newNode);
    ctx.selectNode({
      current() {
        return node.properties.find((n) => n.id === newNode.id);
      },
      update(newNode) {
        const idx = node.properties.findIndex((n) => n.id === newNode.id);
        node.properties[idx] = newNode;
      },
    });
  };
</script>

<NodeContainer bind:node {draggable}>
  <NodeHeader {node} {draggable} {unmount} />
  <MultiDropZone
    bind:nodes={node.properties}
    {onDrop}
    accept={selectableNode}
  />
</NodeContainer>
