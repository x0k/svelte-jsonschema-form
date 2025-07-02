<script lang="ts">
  import {
    createObjectProperty,
    type NodeType,
    type ObjectPropertyNode,
    type CustomizableNode,
  } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import {
    getBuilderContext,
    isObjectPropertyNode,
    isCustomizableOrPropertyNode,
  } from "../../context.svelte.js";
  import MultiDropZone from "../../multi-dropzone.svelte";
  import NodeHeader from "../../node-header.svelte";
  import NodeContainer from "../../node-container.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Object> = $props();

  const ctx = getBuilderContext();

  const onDrop = (
    newNode: CustomizableNode | ObjectPropertyNode,
    index: number
  ) => {
    const prop = isObjectPropertyNode(newNode)
      ? newNode
      : createObjectProperty(newNode);
    node.properties.splice(index, 0, prop);
    ctx.selectNode({
      current() {
        return node.properties.find((n) => n.id === prop.id)?.property;
      },
      update(newNode) {
        const idx = node.properties.findIndex((n) => n.id === prop.id);
        node.properties[idx].property = newNode;
      },
    });
  };
</script>

<NodeContainer bind:node {draggable}>
  <NodeHeader {node} {draggable} {unmount} disablePadding />
  <MultiDropZone
    bind:nodes={node.properties}
    accept={isCustomizableOrPropertyNode}
    {onDrop}
  />
</NodeContainer>
