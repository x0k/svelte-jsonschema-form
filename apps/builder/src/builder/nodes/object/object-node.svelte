<script lang="ts">
  import {
    createObjectProperty,
    isObjectPropertyNode,
    isCustomizableOrPropertyNode,
    type NodeType,
    type ObjectPropertyNode,
    type CustomizableNode,
  } from "$lib/builder/index.js";

  import type { NodeProps } from "../../model.js";
  import { getBuilderContext } from "../../context.svelte.js";
  import MultiDropZone from "../../multi-dropzone.svelte";
  import NodeHeader from "../../customizable-node-header.svelte";
  import NodeContainer from "../../node-container.svelte";
  import NodeIssues from "../../node-issues.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
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
    ctx.selectNode(
      {
        current() {
          return node.properties.find((n) => n.id === prop.id)?.property;
        },
        update(newNode) {
          const idx = node.properties.findIndex((n) => n.id === prop.id);
          node.properties[idx].property = newNode;
        },
      },
      true
    );
  };
</script>

<NodeContainer
  bind:node
  {draggable}
  {showRequired}
  class="flex flex-col gap-0.5"
>
  <NodeHeader
    {node}
    {draggable}
    {unmount}
    disablePadding={node.properties.length > 0}
    {showRequired}
  />
  <MultiDropZone
    showRequired
    bind:nodes={node.properties}
    accept={isCustomizableOrPropertyNode}
    {onDrop}
  />
  <NodeIssues class={[node.properties.length === 0 && "pt-4"]} {node} />
</NodeContainer>
